from typing import List
from sqlalchemy.orm import Session
from app.models.device import Device
from app.models.room import Room

class DeviceService:

    @staticmethod
    def create_device(name: str, room_id: int = None, db: Session = None) -> Device:
        new_device = Device(name=name, active=False)
        if room_id:
            room = db.query(Room).filter(Room.id == room_id).first()
            if not room:
                raise ValueError("Cômodo não encontrado")
            new_device.room_id = room.id
        db.add(new_device)
        db.commit()
        db.refresh(new_device)
        return new_device

    @staticmethod
    def get_device(device_id: int, db: Session) -> Device:
        device = db.query(Device).filter(Device.id == device_id).first()
        if not device:
            raise ValueError("Dispositivo não encontrado")
        return device

    @staticmethod
    def list_devices(db: Session) -> List[Device]:
        return db.query(Device).all()

    @staticmethod
    def toggle_device(device_id: int, active: bool, db: Session) -> Device:
        device = DeviceService.get_device(device_id, db)
        device.active = active
        db.commit()
        db.refresh(device)
        return device

    @staticmethod
    def delete_device(device_id: int, db: Session):
        device = DeviceService.get_device(device_id, db)
        db.delete(device)
        db.commit()
        return {"message": "Dispositivo removido com sucesso"}
