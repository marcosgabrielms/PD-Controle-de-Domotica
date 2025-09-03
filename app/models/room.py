from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    devices = relationship("Device", back_populates="room", cascade="all, delete")
    scenes = relationship("Scene", back_populates="room", cascade="all, delete")
