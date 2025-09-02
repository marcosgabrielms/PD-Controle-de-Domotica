from typing import List
from app.schemas.room import RoomResponse
from app.schemas.device import DeviceResponse

rooms_db: List[RoomResponse] = []

class RoomService:

    @staticmethod
    def create_room(name: str) -> RoomResponse:
        """
        Cria um novo cômodo com ID único.
        """
        new_id = len(rooms_db) + 1
        new_room = RoomResponse(id=new_id, name=name, scenes=[], devices=[])
        rooms_db.append(new_room)
        return new_room

    @staticmethod
    def add_devices_to_room(room: RoomResponse, devices: List[DeviceResponse]) -> RoomResponse:
        """
        Adiciona um dispositivo há um cômodo.
        """
        for device in devices:
            if all(d.id != device.id for d in room.devices):
                room.devices.append(device)
        return room

    @staticmethod
    def remove_device_from_room(room: RoomResponse, device_id: int) -> RoomResponse:
        """
        Remove dispositivo do cômodo e atualiza cenas associadas.
        """
        # Remove dispositivo do cômodo
        room.devices = [d for d in room.devices if d.id != device_id]

        # Atualiza cenas: remove o dispositivo de todas as cenas do cômodo
        for scene in room.scenes:
            scene.devices = [d for d in scene.devices if d.id != device_id]

        # Remove cenas que ficaram sem dispositivos
        room.scenes = [s for s in room.scenes if s.devices]

        return room