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


@app.patch('/profile')
@jwt_required()
def patch_user():
    current_user = get_jwt_identity()
    user = User.query.get(int(current_user))
    if not user:
        return jsonify({'error': 'No account found'}), 404
    else: 
        data = request.json
        user.avatarBase64 = data['avatarBase64']
        db.session.commit()
        return jsonify(user.toJSON()), 202
    

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

@app.post('/checkpoll/<int:id>')
@jwt_required()
def check_poll(id):
    current_user = get_jwt_identity()
    user = User.query.get(int(current_user))
    if not user:
        print("no user found")
        return jsonify({'error': 'No account found'}), 404
    poll = Poll.query.get(id)
    responded = False
    pastResponse = {}
    if poll:
        responses = poll.responses
        for response in responses:
            if response.user_id == user.id:
                responded = True
                pastResponse = response.to_dict()
        return jsonify({"responded" : responded, "pastResponse": pastResponse }), 200
    else:
        print("no poll found")
        return {}, 404

@app.post('/getresponses/<int:id>')
@jwt_required()
def get_responses(id):
    current_user = get_jwt_identity()
    user = User.query.get(int(current_user))
    if not user:
        print("no user found")
        return jsonify({'error': 'No account found'}), 404
    poll = Poll.query.get(id)
    if poll:
        responses = poll.responses
        serializedRes = []
        option1Tally = 0
        option2Tally = 0
        for response in responses:
            if response.response == poll.option1:
                option1Tally += 1
            elif response.response == poll.option2:
                option2Tally += 1
            serializedRes.append(response.to_dict())
        return jsonify({"responses": serializedRes, "option1Tally": option1Tally, "option2Tally": option2Tally}), 200
    else:
        print("no poll found")
        return {}, 404

@app.post('/getpollstats/<int:id>')
@jwt_required()
def get_poll_stats(id):
    current_user = get_jwt_identity()
    user = User.query.get(int(current_user))
    if not user:
        print("no user found")
        return jsonify({'error': 'No account found'}), 404
    poll = Poll.query.get(id)
    if poll:
        responses = poll.responses
        option1Tally = 0
        option2Tally = 0
        for response in responses:
            if response.response == poll.option1:
                option1Tally += 1
            elif response.response == poll.option2:
                option2Tally += 1
        return jsonify({"option1Tally": option1Tally, "option2Tally": option2Tally}), 200
    else:
        print("no poll found")
        return {}, 404

@app.post('/deleteresponse/<int:id>')
@jwt_required()
def delete_response(id):
    current_user = get_jwt_identity()
    user = User.query.get(int(current_user))
    if not user:
        print("no user found")
        return jsonify({'error': 'No account found'}), 404
    poll = Poll.query.get(id)
    responseID = None
    if poll:
        responses = poll.responses
        for response in responses:
            if response.user_id == user.id:
                responseID = response.id
                userResponse = Response.query.get(responseID)
                db.session.delete(userResponse)
                db.session.commit()
                return {}, 200
        print("no response found")
        return {}, 404
    else:
        print("no poll found")
        return {}, 404

@app.post('/addresponse/<int:id>')
@jwt_required()
def add_response(id):
    current_user = get_jwt_identity()
    user = User.query.get(int(current_user))
    if not user:
        print("no user found")
        return jsonify({'error': 'No account found'}), 404
    poll = Poll.query.get(id)
    if poll:
        responses = poll.responses
        for response in responses:
            if response.user_id == user.id:
                print("already responded")
                return {{'error': 'already responded'}}, 404
        data = request.json
        newResponse = Response(data['response'], user.id, poll.id)
        db.session.add(newResponse)
        db.session.commit()
        return jsonify(newResponse.to_dict()), 201
    else:
        print("no poll found")
        return {}, 404


@app.post('/yourpolls')
@jwt_required()
def your_polls():
    current_user = get_jwt_identity()
    user = User.query.get(int(current_user))
    if not user:
        print("no user found")
        return jsonify({'error': 'No account found'}), 404
    polls = Poll.query.filter_by(user_id=user.id)
    return jsonify([poll.to_dict() for poll in polls]), 200

@app.post('/createpoll')
@jwt_required()
def create_poll():
    current_user = get_jwt_identity()
    user = User.query.get(int(current_user))
    print(user.id)
    if not user:
        print("no user found")
        return jsonify({'error': 'No account found'}), 404
    data = request.json
    newPoll = Poll(question=data['question'], option1=data['option1'], option2=data['option2'], user_id=user.id)
    db.session.add(newPoll)
    db.session.commit()
    return jsonify(newPoll.toJSON()), 201

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
