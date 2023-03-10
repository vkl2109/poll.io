from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import json
from datetime import datetime

db = SQLAlchemy()
migrate = Migrate(db)

friendships = db.Table('friendships',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('friend_id', db.Integer, db.ForeignKey('user.id'))
)
class User(db.Model):
    # __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    avatarBase64 = db.Column(db.Text())
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())
    polls = db.relationship('Poll', backref='user', cascade='all, delete-orphan', lazy=True)
    responses = db.relationship('Response', backref='user', cascade='all, delete-orphan', lazy=True)
    friendrequests = db.relationship(
        'FriendRequest', backref='user', cascade='all, delete-orphan', lazy=True)
    friends = db.relationship(
        'User', secondary=friendships,
        primaryjoin=(friendships.c.user_id == id),
        secondaryjoin=(friendships.c.friend_id == id),
        backref=db.backref('friendships', lazy='dynamic'), lazy='dynamic')

    def all_requests(self):
        return [request.recipient for request in self.friendrequests]
    
    def befriend(self, friend):
        if friend not in self.friends:
            self.friends.append(friend)
            friend.friends.append(self)

    def unfriend(self, friend):
        if friend in self.friends:
            self.friends.remove(friend)
            friend.friends.remove(self)

    def toJSON(self):
        return {"id": self.id, "username": self.username, "password": self.password, "avatarBase64": self.avatarBase64}

    def __init__(self, username, password, avatarBase64=''):
        self.username = username
        self.password = password
        self.avatarBase64 = avatarBase64

    def __repr__(self):
        return '<User %r>' % self.username


class Poll(db.Model):
    # __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(80), nullable=False)
    option1 = db.Column(db.String(80), nullable=False)
    option2 = db.Column(db.String(80), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())
    responses = db.relationship('Response', backref='poll', cascade='all, delete-orphan', lazy=True)

    def toJSON(self):
        return {"id": self.id, "question": self.question, "option1": self.option1, "option2": self.option2, "user_id": self.user_id, "created_at": self.created_at.isoformat()}

    def to_dict(self):
        user = User.query.get(self.user_id)
        option1Tally = 0
        option2Tally = 0
        for response in self.responses:
            if response.response == self.option1:
                option1Tally += 1
            elif response.response == self.option2:
                option2Tally += 1
        return {"user": {"avatarBase64": user.avatarBase64, "username": user.username}, "poll": self.toJSON(), "responses": [response.to_dict() for response in self.responses], "option1Tally": option1Tally, "option2Tally": option2Tally}

    def __init__(self, question, option1, option2, user_id):
        self.question = question
        self.option1 = option1
        self.option2 = option2
        self.user_id = user_id

    def __repr__(self):
        return '<Poll %r>' % self.question

class Response(db.Model):
    # __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    response = db.Column(db.String(80), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    poll_id = db.Column(db.Integer, db.ForeignKey('poll.id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    def toJSON(self):
        return {"id": self.id, "response": self.response, "user_id": self.user_id, "poll_id": self.poll_id}

    def to_dict(self):
        user = User.query.get(self.user_id)
        return {"response": self.response, "username": user.username}

    def __init__(self, response, user_id, poll_id):
        self.response = response
        self.user_id = user_id
        self.poll_id = poll_id

    def __repr__(self):
        return '<Response %r>' % self.response
    
class FriendRequest(db.Model):
    # __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    sender = db.Column(db.String(80), nullable=False)
    recipient = db.Column(db.String(80), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    accepted = db.Column(db.Boolean(), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    def toJSON(self):
        return {"id": self.id, "sender": self.sender, "recipient": self.recipient, "user_id": self.user_id, "accepted": self.accepted}

    def __init__(self, sender, recipient, user_id, accepted=False):
        self.sender = sender
        self.recipient = recipient
        self.user_id = user_id
        self.accepted = accepted

    def __repr__(self):
        return '<FriendRequest %r>' % self.recipient
