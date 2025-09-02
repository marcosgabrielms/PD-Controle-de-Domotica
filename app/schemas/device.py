from typing import Optional
from pydantic import BaseModel, Field

class DeviceCreate(BaseModel):
    name: str = Field(..., example="Lâmpada da Sala")
    room_id: Optional[int] = None  # Pode não estar associado a um cômodo ainda

class DeviceToggle(BaseModel):
    active: bool
    
class DeviceResponse(BaseModel):
    id: int
    name: str = Field(..., example="Lâmpada da Sala")
    active: bool = False
    room_id: Optional[int] = None  # Pode não estar associado a um cômodo ainda
