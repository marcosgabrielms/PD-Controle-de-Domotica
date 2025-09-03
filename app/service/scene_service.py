from typing import List, Optional
from app.schemas.scene import SceneCreate
from sqlalchemy.orm import joinedload
from app.models.device import Device
from sqlalchemy.orm import Session
from app.models.scene import Scene
from app.models.room import Room

class SceneService:
    @staticmethod
    def create_scene(db: Session, room: Room, scene_create: SceneCreate) -> Scene:
        devices = db.query(Device).filter(Device.id.in_(scene_create.device_ids)).all()
        if not devices:
            raise ValueError("Nenhum dispositivo válido encontrado para a cena")
        new_scene = Scene(
            name=scene_create.scene_name,  # <- pega do Pydantic
            code_active=scene_create.code_active,
            active=False,
            room_id=room.id
        )
        new_scene.devices = devices
        db.add(new_scene)
        db.commit()
        db.refresh(new_scene)
        return new_scene
        
    @staticmethod
    def add_devices_to_scene(scene: Scene, device_ids: List[int], db: Session) -> Scene:
        devices = db.query(Device).filter(Device.id.in_(device_ids)).all()
        for device in devices:
            if device not in scene.devices:
                scene.devices.append(device)
        db.commit()
        db.refresh(scene)
        return scene

    # Remove dispositivos
    @staticmethod
    def remove_devices_from_scene(scene: Scene, device_ids: List[int], db: Session) -> Optional[Scene]:
        scene.devices = [d for d in scene.devices if d.id not in device_ids]

        if not scene.devices:
            db.delete(scene)
            db.commit()
            return None  # cena deletada

        db.commit()
        db.refresh(scene)
        return scene

    # Ativar cena e dispositivos vinculados
    @staticmethod
    def activate_scene(scene_id: int, db: Session) -> bool:
        scene = db.query(Scene).options(joinedload(Scene.devices)).filter(Scene.id == scene_id).first()
        if not scene:
            raise ValueError("Cena não encontrada")

        scene.active = True
        for device in scene.devices:
            device.active = True  
        db.commit()  
        db.refresh(scene)
        return True

    @staticmethod
    def deactivate_scene(scene_id: int, db: Session) -> bool:
        scene = db.query(Scene).options(joinedload(Scene.devices)).filter(Scene.id == scene_id).first()
        if not scene:
            raise ValueError("Cena não encontrada")

        scene.active = False
        for device in scene.devices:
            device.active = False  
        db.commit()
        db.refresh(scene)
        return True

    @staticmethod
    def get_scene(scene_id: int, db: Session) -> Scene:
        scene = db.query(Scene).filter(Scene.id == scene_id).first()
        if not scene:
            raise ValueError("Cena não encontrada")
        return scene

    @staticmethod
    def list_scenes(db: Session) -> List[Scene]:
        return db.query(Scene).all()
