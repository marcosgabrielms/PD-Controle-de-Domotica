from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    active = Column(Boolean, default=False)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=True)

    room = relationship("Room", back_populates="devices")
    scenes = relationship(
        "Scene",
        secondary="scene_devices",
        back_populates="devices",
        overlaps="devices"
    )
