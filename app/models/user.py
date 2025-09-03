from sqlalchemy import Column, Integer, String
from app.database import Base  # importa o Base que você acabou de criar

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
