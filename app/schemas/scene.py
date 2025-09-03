<<<<<<< HEAD
from typing import List, Optional
=======
from typing import List
>>>>>>> c49effb5a8eb7d244a068ccfcdafad00369f6f15
from pydantic import BaseModel, Field, field_validator
from app.schemas.device import DeviceResponse

class SceneCreate(BaseModel):
<<<<<<< HEAD
    scene_name: str
    device_ids: List[int]
=======
    name: str = Field(..., example="Cena Iluminação")
    devices: List[DeviceResponse]  # Obrigatório: pelo menos um dispositivo
>>>>>>> c49effb5a8eb7d244a068ccfcdafad00369f6f15
    code_active: str

class SceneResponse(BaseModel):
    id: int
<<<<<<< HEAD
    name: str
    devices: Optional[List[DeviceResponse]] = []  # <- permite vazio
=======
    name: str = Field(..., example="Cena Iluminação")
    devices: List[DeviceResponse]  # Pelo menos um dispositivo
>>>>>>> c49effb5a8eb7d244a068ccfcdafad00369f6f15
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
