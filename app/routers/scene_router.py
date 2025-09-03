<<<<<<< HEAD
from fastapi import APIRouter, HTTPException, Body, Depends
from typing import List, Optional
from sqlalchemy.orm import Session
from app.schemas.scene import SceneResponse, SceneActivate, SceneDevices
from app.service.scene_service import SceneService
from app.database import get_db
from app.service.scene_service import Scene
=======
from app.schemas.scene import SceneResponse, SceneActivate, SceneDevices 
from app.service.scene_service import SceneService, scenes_db
from app.service.room_service import rooms_db
from fastapi import APIRouter, HTTPException
from typing import List
>>>>>>> c49effb5a8eb7d244a068ccfcdafad00369f6f15

router = APIRouter(
    prefix="/scenes",
    tags=["Scenes"]
)

<<<<<<< HEAD
# Listar todas cenas
@router.get("/", response_model=List[SceneResponse])
def list_scenes(db: Session = Depends(get_db)):
    return SceneService.list_scenes(db)

# Pesquisar cena por ID
@router.get("/{scene_id}", response_model=SceneResponse)
def get_scene(scene_id: int, db: Session = Depends(get_db)):
    try:
        return SceneService.get_scene(scene_id, db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

# Adicionar dispositivos a cena
@router.post("/{scene_id}/devices", response_model=SceneResponse)
def add_devices_to_scene(scene_id: int, payload: SceneDevices, db: Session = Depends(get_db)):
    try:
        scene = SceneService.get_scene(scene_id, db)
        return SceneService.add_devices_to_scene(scene, payload.device_ids, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Remover dispositivos da cena
@router.delete("/{scene_id}/devices", response_model=Optional[SceneResponse])
def remove_devices_from_scene(scene_id: int, payload: SceneDevices, db: Session = Depends(get_db)):
    scene = SceneService.get_scene(scene_id, db)
    updated_scene = SceneService.remove_devices_from_scene(scene, payload.device_ids, db)

    if updated_scene is None:
        return None  # ou {"message": "Cena deletada porque não tinha mais dispositivos"}

    return updated_scene

# Ativar cena
@router.post("/{scene_id}/activate")
def activate_scene(scene_id: int, payload: SceneActivate, db: Session = Depends(get_db)):
    # Busca a cena pelo ID
    scene = db.query(Scene).filter(Scene.id == scene_id).first()
    if not scene:
        raise HTTPException(status_code=404, detail="Cena não encontrada")
    
    # Verifica se o código informado bate com o code_active da cena
    if scene.code_active != payload.code_active:
        raise HTTPException(status_code=400, detail="Código de ativação incorreto")
    
    # Atualiza a cena como ativa
    # Ativar cena
    scene = db.query(Scene).filter(Scene.id == scene_id).first()
    if not scene:
        raise HTTPException(status_code=404, detail="Cena não encontrada")

    scene.active = True   # só atualizar o campo
    db.commit()           # salva no banco
    db.refresh(scene)     # opcional, atualiza o objeto com o DB


# Desativar cena
@router.post("/{scene_id}/deactivate", response_model=SceneResponse)
def deactivate_scene_route(scene_id: int, db: Session = Depends(get_db)):
    try:
        scene = SceneService.deactivate_scene(scene_id, db)
        return scene
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

=======
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
>>>>>>> c49effb5a8eb7d244a068ccfcdafad00369f6f15
