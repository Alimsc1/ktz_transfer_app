from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import List
from pydantic import BaseModel
from sqlalchemy.orm import Session
import csv, io, jwt, time

from app import models, database, crud

models.Base.metadata.create_all(bind=database.engine)
app = FastAPI()

# --- CORS для React ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- JWT конфигурация ---
SECRET_KEY = "very-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = 3600
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# --- Pydantic модели ---
class WagonItem(BaseModel):
    wagon_number: str
    direction: str
    date: str
    status: str
    weight: float

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str
    role: str


# --- Аутентификация и авторизация ---
def create_access_token(data: dict):
    to_encode = data.copy()
    to_encode["exp"] = time.time() + ACCESS_TOKEN_EXPIRE_SECONDS
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Не валидный токен")
        user = crud.get_user_by_username(db, username)
        if user is None:
            raise HTTPException(status_code=401, detail="Пользователь не найден")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Токен истёк")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Ошибка токена")

def require_admin(user = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    return user


# --- Эндпоинты ---
@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Неверные данные")
    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/data")
def get_data(db: Session = Depends(database.get_db), user=Depends(get_current_user)):
    return crud.get_all_items(db)

@app.post("/upload")
def upload_data(items: List[WagonItem], db: Session = Depends(database.get_db), user=Depends(require_admin)):
    for item in items:
        crud.create_item(db, item)
    return {"status": "uploaded"}

@app.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(database.get_db), user=Depends(require_admin)):
    contents = await file.read()
    decoded = contents.decode("utf-8")
    csv_reader = csv.DictReader(io.StringIO(decoded))

    status_mapping = {
        "на складе": "прибыл на станцию",
        "разгружен": "растаможен",
        "уехал": "отправлен",
        "на станции": "прибыл на станцию"
    }

    for row in csv_reader:
        raw_status = row["status"].strip().lower()
        mapped_status = status_mapping.get(raw_status, raw_status)

        item = models.WagonData(
            wagon_number=row["wagon_number"],
            direction=row["direction"],
            date=row["date"],
            status=mapped_status,
            weight=float(row["weight"])
        )
        db.add(item)

    db.commit()
    return {"status": "uploaded via CSV"}

@app.put("/update-status")
def update_status(
    payload: dict = Body(...),
    db: Session = Depends(database.get_db),
    user = Depends(get_current_user)
):
    wagon_number = payload.get("wagon_number")
    new_status = payload.get("status")

    if not wagon_number or not new_status:
        raise HTTPException(status_code=400, detail="Отсутствуют данные")

    item = db.query(models.WagonData).filter_by(wagon_number=wagon_number).first()
    if not item:
        raise HTTPException(status_code=404, detail="Контейнер не найден")

    item.status = new_status
    db.commit()
    return {"success": True, "new_status": new_status}
