from typing import List
from pydantic import BaseModel, Field, field_validator
from app.schemas.device import DeviceResponse

class SceneCreate(BaseModel):
    name: str = Field(..., example="Cena Iluminação")
    devices: List[DeviceResponse]  # Obrigatório: pelo menos um dispositivo
    code_active: str

class SceneResponse(BaseModel):
    id: int
    name: str = Field(..., example="Cena Iluminação")
    devices: List[DeviceResponse]  # Pelo menos um dispositivo
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
