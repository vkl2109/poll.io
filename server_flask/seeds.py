from app import app
from models import db, User, Poll, Response
from datetime import datetime


def run_seeds():
    with app.app_context():
        db.drop_all()
        db.create_all()
        print('Seeding database ... 🌱')

        user1 = User('izickh', 'inh2102', '')
        db.session.add(user1)
        db.session.commit()

        user2 = User('littleorange', 'eemileh', '')
        db.session.add(user2)
        db.session.commit()

        user3 = User('sandstormdancer', 'chinarichgf', '')
        db.session.add(user3)
        db.session.commit()

        poll1 = Poll('What should I eat for dinner?',
                     'pizza', 'pasta', user1.id)
        db.session.add(poll1)
        db.session.commit()
        poll2 = Poll("What is my mother's name?",
                     'Cindy', 'Sarah', user2.id)
        db.session.add(poll2)
        db.session.commit()
        poll3 = Poll("What is my kitty's name?",
                     'Noodles', 'Udon', user3.id)
        db.session.add(poll3)
        db.session.commit()

        response1 = Response('pizza', user2.id, poll1.id)
        db.session.add(response1)
        db.session.commit()
        response2 = Response('pizza', user3.id, poll1.id)
        db.session.add(response2)
        db.session.commit()
        response3 = Response('Cindy', user1.id, poll2.id)
        db.session.add(response3)
        db.session.commit()
        response4 = Response('Sarah', user3.id, poll2.id)
        db.session.add(response4)
        db.session.commit()
        response5 = Response('Udon', user1.id, poll3.id)
        db.session.add(response5)
        db.session.commit()
        response5 = Response('Noodles', user2.id, poll3.id)
        db.session.add(response5)
        db.session.commit()

        print('Done! 🌳')
run_seeds()
