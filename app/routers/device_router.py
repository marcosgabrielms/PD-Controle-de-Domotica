<<<<<<< HEAD
from fastapi import APIRouter, HTTPException, Body, Depends
from typing import List
from sqlalchemy.orm import Session
from app.schemas.device import DeviceResponse, DeviceCreate, DeviceToggle
from app.service.device_service import DeviceService
from app.database import get_db
=======
from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.device import DeviceResponse, DeviceCreate, DeviceToggle
from app.service.device_service import DeviceService, devices_db
>>>>>>> c49effb5a8eb7d244a068ccfcdafad00369f6f15

router = APIRouter(
    prefix="/devices",
    tags=["Devices"]
)

# Criar dispositivo
@router.post("/", response_model=DeviceResponse)
<<<<<<< HEAD
def create_device(device: DeviceCreate, db: Session = Depends(get_db)):
    try:
        new_device = DeviceService.create_device(device.name, device.room_id, db)
        return new_device
=======
def create_device(device: DeviceCreate, room_id: int = None):
    try:
        device = DeviceService.create_device(device.name, room_id)
        return device
>>>>>>> c49effb5a8eb7d244a068ccfcdafad00369f6f15
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Listar todos dispositivos
@router.get("/", response_model=List[DeviceResponse])
<<<<<<< HEAD
def list_devices(db: Session = Depends(get_db)):
    return DeviceService.list_devices(db)

# Pesquisar dispositivo por ID
@router.get("/{device_id}", response_model=DeviceResponse)
def get_device(device_id: int, db: Session = Depends(get_db)):
    try:
        return DeviceService.get_device(device_id, db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

# Atualizar status do dispositivo (ligar/desligar)
@router.post("/{device_id}/toggle", response_model=DeviceResponse)
def toggle_device(device_id: int, toggle: DeviceToggle = Body(...), db: Session = Depends(get_db)):
    try:
        return DeviceService.toggle_device(device_id, toggle.active, db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

# Remover dispositivo
@router.delete("/{device_id}")
def remove_device(device_id: int, db: Session = Depends(get_db)):
    try:
        return DeviceService.delete_device(device_id, db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
=======
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
>>>>>>> c49effb5a8eb7d244a068ccfcdafad00369f6f15
