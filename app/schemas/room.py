from typing import List
from pydantic import BaseModel, Field
from app.schemas.scene import SceneResponse
from app.schemas.device import DeviceResponse

class GetDevices(BaseModel):
    device_ids: List[int]

class GetRoom(BaseModel):
    name: str = Field(..., example="Sala de Estar")

class RoomResponse(BaseModel):
    id: int
    name: str = Field(..., example="Sala de Estar")
    scenes: List[SceneResponse] = []    # Pode ter 0 ou mais cenas
    devices: List[DeviceResponse] = []  # Pode ter 0 ou mais dispositivos

# Para criar cenas no cômodo
class CreateSceneRequest(BaseModel):
    scene_name: str
    device_ids: List[int]
    code_active: str