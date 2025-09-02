from pydantic import BaseModel, Field
from typing import Optional

class GetUser(BaseModel):
    name: str = Field(..., example="Daniel Vitor Barroso")
    age: int

class UserResponse(BaseModel):
    id: int
    name: str = Field(..., example="Daniel Vitor Barroso")
    age: int

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, example="Novo Nome")
    age: Optional[int] = Field(None, example=30)