from typing import List
<<<<<<< HEAD
from sqlalchemy.orm import Session
from app.models.device import Device
from app.models.room import Room
=======
from app.schemas.device import DeviceResponse
from app.schemas.room import RoomResponse
from app.schemas.scene import SceneResponse
import asyncio

devices_db: List[DeviceResponse] = []  # Banco de dados em memória global
>>>>>>> c49effb5a8eb7d244a068ccfcdafad00369f6f15

class DeviceService:

    @staticmethod
<<<<<<< HEAD
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
=======
    def create_device(name: str, room: RoomResponse = None) -> DeviceResponse:
        """
        Cria um novo dispositivo com ID único.
        Pode ser associado a um cômodo ao ser criado.
        """
        new_id = len(devices_db) + 1
        new_device = DeviceResponse(
            id=new_id,
            name=name,
            active=False,
            room_id=room.id if room else None
        )

        devices_db.append(new_device)

        # Adiciona ao cômodo, se informado
        if room:
            if new_device not in room.devices:
                room.devices.append(new_device)

        return new_device

    @staticmethod
    async def activate_device(device: DeviceResponse, delay: int = 0):
        """
        Ativa um dispositivo individualmente, com opção de delay (em segundos).
        """
        if delay > 0:
            await asyncio.sleep(delay)
        device.active = True
        print(f"Dispositivo {device.name} ativado.")

    @staticmethod
    def deactivate_device(device: DeviceResponse):
        """
        Desativa um dispositivo individualmente.
        """
        device.active = False
        print(f"Dispositivo {device.name} desativado.")
>>>>>>> c49effb5a8eb7d244a068ccfcdafad00369f6f15
