from typing import List, Optional
from pydantic import BaseModel, Field, field_validator
from app.schemas.device import DeviceResponse

class SceneCreate(BaseModel):
    scene_name: str
    device_ids: List[int]
    code_active: str

class SceneResponse(BaseModel):
    id: int
    name: str
    devices: Optional[List[DeviceResponse]] = []  # <- permite vazio
    active: bool = False
    code_active: str

    @field_validator('devices')
    def must_have_devices(cls, v):
        if not v:
            raise ValueError("Uma cena precisa ter pelo menos um dispositivo")
        return v

class SceneDevices(BaseModel):
    device_ids: List[int]

class SceneActivate(BaseModel):
    code_active: str
