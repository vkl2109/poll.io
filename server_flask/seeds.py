from app import app
from models import db, User
from datetime import datetime


def run_seeds():
    with app.app_context():
        db.drop_all()
        db.create_all()
        print('Seeding database ... 🌱')

        user1 = User('a', 'a')
        db.session.add(user1)
        db.session.commit()

        user2 = User('b', 'b')
        db.session.add(user2)
        db.session.commit()

        print('Done! 🌳')


run_seeds()
