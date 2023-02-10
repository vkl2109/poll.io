from app import app
from models import db, User, Poll, Response
from datetime import datetime
from flask_bcrypt import generate_password_hash, check_password_hash

def run_seeds():
    with app.app_context():
        db.drop_all()
        db.create_all()
        print('Seeding database ... 🌱')
        print('Done! 🌳')
run_seeds()
