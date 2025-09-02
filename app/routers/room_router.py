from fastapi import APIRouter, HTTPException, Body
from typing import List
from app.schemas.room import RoomResponse, GetDevices, GetRoom, CreateSceneRequest
from app.schemas.scene import SceneResponse
from app.service.room_service import RoomService, rooms_db
from app.service.scene_service import SceneService
from app.service.device_service import devices_db

router = APIRouter(
    prefix="/rooms", 
    tags=["Rooms"]
)

# Criar cômodo
@router.post("/", response_model=RoomResponse)
def create_room(room: GetRoom):
    try:
        return RoomService.create_room(room.name)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- Atualizar nome do cômodo ---
@router.put("/{room_id}", response_model=RoomResponse)
def update_room_name(room_id: int, request: GetRoom):
    room = next((r for r in rooms_db if r.id == room_id), None)
    if not room:
        raise HTTPException(status_code=404, detail="Cômodo não encontrado")
    room.name = request.name
    return room

@router.delete("/{room_id}")
def delete_room(room_id: int):
    room = next((r for r in rooms_db if r.id == room_id), None)
    if not room:
        raise HTTPException(status_code=404, detail="Cômodo não encontrado")
    rooms_db.remove(room)
    return {"message": "Cômodo removido com sucesso"}

# Listar todos os cômodos
@router.get("/", response_model=List[RoomResponse])
def list_room():
    return rooms_db 

# Pesquisar cômodo por ID
@router.get("/{room_id}", response_model=RoomResponse)
def get_room(room_id: int):
    room = next((r for r in rooms_db if r.id == room_id), None)
    if not room:
        raise HTTPException(status_code=404, detail="Cômodo não encontrado")
    return room

# Adicionar dispositivos ao cômodo
@router.post("/{room_id}/devices", response_model=RoomResponse)
def add_existing_devices_to_room(room_id: int, request: GetDevices = Body(...)):
    room = next((r for r in rooms_db if r.id == room_id), None)
    if not room:
        raise HTTPException(status_code=404, detail="Cômodo não encontrado")
    
    devices_to_add = []
    for did in request.device_ids:
        device = next((d for d in devices_db if d.id == did), None)
        if not device:
            raise HTTPException(status_code=404, detail=f"Dispositivo {did} não encontrado")
        devices_to_add.append(device)
    
    return RoomService.add_devices_to_room(room, devices_to_add)

# Remover dispostivos ao cômodo
@router.delete("/{room_id}/devices", response_model=RoomResponse)
def remove_devices_from_room(room_id: int, request: GetDevices = Body(...)):
    room = next((r for r in rooms_db if r.id == room_id), None)
    if not room:
        raise HTTPException(status_code=404, detail="Cômodo não encontrado")
    for device_id in request.device_ids:
        room = RoomService.remove_device_from_room(room, device_id)
    return room

# Criar cena ao cômodo
@router.post("/{room_id}/scenes", response_model=SceneResponse)
def create_scene_in_room(room_id: int, request: CreateSceneRequest = Body(...)):
    room = next((r for r in rooms_db if r.id == room_id), None)
    if not room:
        raise HTTPException(status_code=404, detail="Cômodo não encontrado")

    devices = [d for d in room.devices if d.id in request.device_ids]
    if not devices:
        raise HTTPException(status_code=400, detail="Nenhum dispositivo válido encontrado para a cena")
    
    try:
        return SceneService.create_scene(room, request.scene_name, devices, request.code_active)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))