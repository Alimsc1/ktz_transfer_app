# scripts/create_users.py

from app import models, database
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

users = [
    {"username": "admin", "password": "admin123", "role": "admin"},
    {"username": "logist", "password": "logist123", "role": "logist"},
    {"username": "viewer", "password": "viewer123", "role": "viewer"},
]

def create_users():
    db = database.SessionLocal()
    for user_data in users:
        hashed = pwd_context.hash(user_data["password"])
        user = models.User(username=user_data["username"], hashed_password=hashed, role=user_data["role"])
        db.add(user)
    db.commit()
    db.close()
    print("✅ Пользователи успешно добавлены!")

if __name__ == "__main__":
    create_users()
