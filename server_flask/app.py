import os
from flask import Flask, send_file, request, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config
from models import db, User, Poll, Response
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from flask_socketio import SocketIO, send, emit

app = Flask(__name__, static_folder='public')
CORS(app, origins=['*'])
app.config.from_object(Config)
jwt = JWTManager(app)
db.init_app(app)
migrate = Migrate(app, db)
socketio = SocketIO(app, cors_allowed_origins='*')


@app.get('/')
def home():
    return send_file('welcome.html')


@app.post('/login')
def login():
    data = request.json
    print('data is', data)
    user = User.query.filter_by(username=data['username']).first()
    if not user:
        return jsonify({'error': 'No account found'}), 404
    else:
        given_password = data['password']
        if user.password == given_password:
            access_token = create_access_token(identity=user.id)
            # print(access_token)
            return jsonify({'user': user.toJSON(), 'token': access_token}), 200
        else:
            return jsonify({'error': 'Invalid Password'}), 422


@app.post('/autologin')
@jwt_required()
def auto_login():
    current_user = get_jwt_identity()
    print('user_id is', current_user)

    user = User.query.get(int(current_user))

    if not user:
        return jsonify({'error': 'No account found'}), 404
    else:
        return jsonify(user.toJSON()), 200


@app.post('/signup')
def create_user():
    data = request.json
    user = User(data['username'], data['password'], data['avatarBase64'])
    db.session.add(user)
    db.session.commit()
    return jsonify(user.toJSON()), 201

@app.get('/polls')
def all_polls():
    polls = Poll.query.all()
    if len(polls):
        return jsonify([poll.to_dict() for poll in polls]), 200
    else:
        return {}, 404


@app.post('/yourpolls')
@jwt_required()
def your_polls():
    current_user = get_jwt_identity()
    user = User.query.get(int(current_user))
    polls = Poll.query.filter_by(user_id=user.id)
    return jsonify([poll.to_dict() for poll in polls]), 200

@socketio.on('connect')
@jwt_required()
def connected():
    current_user = User.query.get(get_jwt_identity())
    current_user.sid = request.sid
    db.session.commit()
    emit('connect', {'data': f'id: {request.sid} is connected'})


@socketio.on('data')
def handle_message(data):
    '''This function runs whenever a client sends a socket message to be broadcast'''
    print(f'Message from Client {request.sid} : ', data)
    emit('data', {'data': 'data', 'id': request.sid}, broadcast=True)

    print(jsonify(request.data))

    # @socketio.on("disconnect")
    # def disconnected():
    #     '''This function is an event listener that gets called when the client disconnects from the server'''
    #     print(f'Client {request.sid} has disconnected')
    #     emit('disconnect',
    #          f'Client {request.sid} has disconnected', broadcast=True)

    # @socketio.on('join')
    # def handle_join(room_name):
    #     join_room(room_name)
    #     emit('join_success', {'message': f'Successfully joined room {room_name}'}, room=room_name)


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=os.environ.get('PORT', 3001), debug=True)
