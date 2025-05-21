from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app import models

# Пароли (хеширование)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- 🚂 ДАННЫЕ ПО ВАГОНАМ ---

def create_item(db, item):
    db_item = models.WagonData(
        wagon_number=item.wagon_number,
        direction=item.direction,
        date=item.date,
        status=item.status,
        weight=item.weight
    )
    db.add(db_item)
    db.commit()

def get_all_items(db):
    return db.query(models.WagonData).all()

# --- 👤 ПОЛЬЗОВАТЕЛИ ---

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


