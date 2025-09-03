from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database import Base

# Tabela associativa Scene <-> Device (muitos-para-muitos)
scene_device_table = Table(
    "scene_devices",
    Base.metadata,
    Column("scene_id", Integer, ForeignKey("scenes.id"), primary_key=True),
    Column("device_id", Integer, ForeignKey("devices.id"), primary_key=True)
)

class Scene(Base):
    __tablename__ = "scenes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code_active = Column(String, nullable=False, unique=True)
    active = Column(Boolean, default=False)
    room_id = Column(Integer, ForeignKey("rooms.id"))

    room = relationship("Room", back_populates="scenes")
    devices = relationship(
        "Device",
        secondary=scene_device_table,
        back_populates="scenes",
        cascade="all",
        overlaps="scenes"
    )
