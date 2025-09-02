from app.schemas.scene import SceneResponse, SceneActivate, SceneDevices 
from app.service.scene_service import SceneService, scenes_db
from app.service.room_service import rooms_db
from fastapi import APIRouter, HTTPException
from typing import List

router = APIRouter(
    prefix="/scenes",
    tags=["Scenes"]
)

# Adicionar dispositivos a cena
@router.post("/{scene_id}/devices", response_model=SceneResponse)
def add_devices_to_scene(scene_id: int, payload: SceneDevices):
    scene = next((s for s in scenes_db if s.id == scene_id), None)
    if not scene:
        raise HTTPException(status_code=404, detail="Cena não encontrada")

    try:
        updated_scene = SceneService.add_devices_to_scene(scene, payload.device_ids)
        return updated_scene
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Listar todos cenas
@router.get("/", response_model=List[SceneResponse])
def list_scene():
    return scenes_db

# Pesquisar cena por ID
@router.get("/{scene_id}", response_model=SceneResponse)
def get_scene(scene_id: int):
    scene = next((u for u in scenes_db if u.id == scene_id), None)
    if not scene:
        raise HTTPException(status_code=404, detail="Cena não encontrada")
    return scene

@router.delete("/{scene_id}/devices")
def remove_devices_from_scene(scene_id: int, payload: SceneDevices):
    scene = next((s for s in scenes_db if s.id == scene_id), None)
    if not scene:
        raise HTTPException(status_code=404, detail="Cena não encontrada")

    try:
        # Remove os dispositivos da cena
        result = SceneService.remove_devices_from_scene(scene, payload.device_ids)

        # ✅ Se a cena ficou vazia (sem devices)
        if not scene.devices:
            # Encontrar todos os rooms que possuem essa cena
            for room in rooms_db:
                if scene in room.scenes:
                    room.scenes.remove(scene)  # Remove a cena do room

            # ✅ Agora remove a cena do banco de cenas
            scenes_db.remove(scene)

        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Ativar cena
@router.post("/{scene_id}/activate")
async def activate_scene(scene_id: int, payload: SceneActivate):
    try:
        result = await SceneService.activate_scene(scene_id, payload.code_active)
        return {"message": "Cena ativada com sucesso", "result": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Desativar cena
@router.post("/{scene_id}/deactivate")
def deactivate_scene(scene_id: int):
    try:
        result = SceneService.deactivate_scene(scene_id)
        return {"message": "Cena desativada com sucesso", "result": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
