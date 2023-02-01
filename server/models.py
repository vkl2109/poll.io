from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import json
from datetime import datetime

db = SQLAlchemy()
migrate = Migrate(db)


class User(db.Model):
    # __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    avatarBase64 = db.Column(db.Text())
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())
    polls = db.relationship('Poll', backref='user', lazy=True)
    responses = db.relationship('Response', backref='user', lazy=True)

    def toJSON(self):
        return {"id": self.id, "username": self.username, "password": self.password, "avatarBase64": self.avatarBase64, "polls": self.polls}

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
    responses = db.relationship('Response', backref='poll', lazy=True)

    def toJSON(self):
        return {"id": self.id, "question": self.question, "option1": self.option1, "option2": self.option2, "user_id": self.user_id}

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

    def __init__(self, response):
        self.response = response

    def __repr__(self):
        return '<Response %r>' % self.response
