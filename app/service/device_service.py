from typing import List
from app.schemas.device import DeviceResponse
from app.schemas.room import RoomResponse
from app.schemas.scene import SceneResponse
import asyncio

devices_db: List[DeviceResponse] = []  # Banco de dados em memória global

class DeviceService:

    @staticmethod
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
