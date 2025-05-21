from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float

Base = declarative_base()

class WagonData(Base):
    __tablename__ = "wagon_data"

    id = Column(Integer, primary_key=True, index=True)
    wagon_number = Column(String)
    direction = Column(String)
    date = Column(String)
    status = Column(String)
    weight = Column(Float)

from sqlalchemy import Boolean

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)  # например: "admin", "logist", "viewer"
    is_active = Column(Boolean, default=True)
