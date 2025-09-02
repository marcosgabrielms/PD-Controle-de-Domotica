from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.device import DeviceResponse, DeviceCreate, DeviceToggle
from app.service.device_service import DeviceService, devices_db

router = APIRouter(
    prefix="/devices",
    tags=["Devices"]
)

# Criar dispositivo
@router.post("/", response_model=DeviceResponse)
def create_device(device: DeviceCreate, room_id: int = None):
    try:
        device = DeviceService.create_device(device.name, room_id)
        return device
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Listar todos dispositivos
@router.get("/", response_model=List[DeviceResponse])
def list_devices():
    return devices_db

# Pesquisar dispositivo por ID
@router.get("/{device_id}", response_model=DeviceResponse)
def get_device(device_id: int):
    device = next((d for d in devices_db if d.id == device_id), None)
    if not device:
        raise HTTPException(status_code=404, detail="Device não encontrado")
    return device

# Atualizar status do dispositivo (ligar/desligar)
@router.post("/{device_id}/toggle", response_model=DeviceResponse)
def toggle_device(device_id: int, toggle: DeviceToggle):
    device = next((d for d in devices_db if d.id == device_id), None)
    if not device:
        raise HTTPException(status_code=404, detail="Dispositivo não encontrado")
    device.active = toggle.active
    return device

# Remover dispositivo
@router.delete("/{device_id}")
def remove_device(device_id: int):
    device = next((d for d in devices_db if d.id == device_id), None)
    if not device:
        raise HTTPException(status_code=404, detail="Dispositivo não encontrado")
    devices_db.remove(device)
    return {"message": "Dispositivo removido com sucesso"}
