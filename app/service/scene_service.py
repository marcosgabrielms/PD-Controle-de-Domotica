from typing import List
from app.schemas.scene import SceneResponse
from app.schemas.device import DeviceResponse
from app.schemas.room import RoomResponse
import asyncio

scenes_db: List[SceneResponse] = []
rooms_db: List[RoomResponse] = []

class SceneService:

    @staticmethod
    def create_scene(room: RoomResponse, scene_name: str, devices: List[DeviceResponse], code_active: str) -> SceneResponse:
        """
        Cria uma cena dentro de um cômodo com os dispositivos selecionados.
        Garante que o código de ativação seja único.
        """

        if not devices:
            raise ValueError("Uma cena precisa ter pelo menos um dispositivo conectado ao cômodo")

        # Garante que todos os dispositivos pertencem ao cômodo
        for d in devices:
            if d not in room.devices:
                raise ValueError(f"Dispositivo {d.name} não pertence ao cômodo {room.name}")

        # Verifica unicidade do código
        if any(scene.code_active == code_active for scene in scenes_db):
            raise ValueError(f"O código '{code_active}' já está em uso por outra cena")

        # Evita nomes duplicados no mesmo cômodo
        if any(scene.name == scene_name for scene in room.scenes):
            raise ValueError(f"Já existe uma cena com o nome '{scene_name}' neste cômodo")

        new_scene = SceneResponse(
            id=len(scenes_db) + 1,
            name=scene_name,
            devices=devices,
            code_active=code_active,
            active=False
        )

        # Salva em memória
        scenes_db.append(new_scene)
        room.scenes.append(new_scene)

        return new_scene
    
    @staticmethod
    def add_devices_to_scene(scene: SceneResponse, device_ids: List[int]) -> SceneResponse:
        for device_id in device_ids:
            # Verifica se já existe
            if any(d.id == device_id for d in scene.devices):
                raise ValueError(f"Dispositivo {device_id} já está na cena")
            
            # Busca dispositivo globalmente
            device = next((d for room in rooms_db for d in room.devices if d.id == device_id), None)
            if not device:
                raise ValueError(f"Dispositivo {device_id} não encontrado em nenhum cômodo")
            
            # Verifica se pertence ao cômodo da cena
            room = next((r for r in rooms_db if scene in r.scenes), None)
            if not room or device not in room.devices:
                raise ValueError(f"Dispositivo {device_id} não pertence ao cômodo da cena")
            
            scene.devices.append(device)
        return scene
    
    @staticmethod
    def remove_devices_from_scene(scene: SceneResponse, device_ids: List[int]) -> dict:
        removed_any = False
        for device_id in device_ids:
            device = next((d for d in scene.devices if d.id == device_id), None)
            if not device:
                raise ValueError(f"Dispositivo {device_id} não está na cena")
            scene.devices.remove(device)
            removed_any = True

        if not removed_any:
            raise ValueError("Nenhum dispositivo foi removido")

        # Se cena ficou vazia → deletar
        if len(scene.devices) == 0:
            scenes_db.remove(scene)
            room = next((r for r in rooms_db if scene in r.scenes), None)
            if room:
                room.scenes.remove(scene)
            return {"message": "Cena excluída porque não havia mais dispositivos"}
        
        return {"message": "Dispositivos removidos da cena com sucesso", "scene": scene}

    @staticmethod
    async def activate_scene(scene_id: int, code_active: str) -> bool:
        """
        Ativa todos os dispositivos de uma cena com intervalo de 3 segundos entre ativações.
        """
        scene = next((s for s in scenes_db if s.id == scene_id), None)
        if not scene:
            raise ValueError("Cena não encontrada")

        if scene.code_active != code_active:
            raise ValueError("Código incorreto")

        for index, device in enumerate(scene.devices):
            device.active = True
            print(f"[{device.name}] ativado.")
            if index < len(scene.devices) - 1:  # só espera se não for o último
                await asyncio.sleep(3)

        scene.active = True  # Atualiza status da cena
        return True

    @staticmethod
    def deactivate_scene(scene_id: int) -> bool:
        scene = next((s for s in scenes_db if s.id == scene_id), None)
        if not scene:
            raise ValueError("Cena não encontrada")

        for device in scene.devices:
            device.active = False

        scene.active = False
        return True
