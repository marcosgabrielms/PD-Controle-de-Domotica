from sqlalchemy.orm import Session
from typing import List
from app.models.room import Room
from app.models.device import Device
from app.service.scene_service import SceneService

class RoomService:

    @staticmethod
    def create_room(name: str, db: Session) -> Room:
        new_room = Room(name=name)
        db.add(new_room)
        db.commit()
        db.refresh(new_room)
        return new_room

    @staticmethod
    def update_room_name(room_id: int, new_name: str, db: Session) -> Room:
        room = db.query(Room).filter(Room.id == room_id).first()
        if not room:
            raise ValueError("Cômodo não encontrado")
        room.name = new_name
        db.commit()
        db.refresh(room)
        return room

    @staticmethod
    def delete_room(room_id: int, db: Session):
        room = db.query(Room).filter(Room.id == room_id).first()
        if not room:
            raise ValueError("Cômodo não encontrado")
        db.delete(room)
        db.commit()
        return {"message": "Cômodo removido com sucesso"}

    @staticmethod
    def list_rooms(db: Session) -> List[Room]:
        return db.query(Room).all()

    @staticmethod
    def get_room(room_id: int, db: Session) -> Room:
        room = db.query(Room).filter(Room.id == room_id).first()
        if not room:
            raise ValueError("Cômodo não encontrado")
        return room

    @staticmethod
    def add_devices_to_room(room: Room, device_ids: List[int], db: Session) -> Room:
        for device_id in device_ids:
            device = db.query(Device).filter(Device.id == device_id).first()
            if device and device not in room.devices:
                room.devices.append(device)
        db.commit()
        db.refresh(room)
        return room

    @staticmethod
    def remove_devices_from_room(room: Room, device_ids: List[int], db: Session) -> Room:
        room.devices = [d for d in room.devices if d.id not in device_ids]
        scenes_to_delete = []
       
        for scene in room.scenes:
            scene.devices = [d for d in scene.devices if d.id not in device_ids]
            if not scene.devices:
                scenes_to_delete.append(scene)

        for scene in scenes_to_delete:
            db.delete(scene)

        db.commit()
        db.refresh(room)
        return room