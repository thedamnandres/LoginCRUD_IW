from pydantic import BaseModel
from typing import Optional


# Para crear o actualizar items
class ItemCreate(BaseModel):
    name: str
    description: Optional[str] = None


# Schema para información básica del propietario
class ItemOwner(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        orm_mode = True


# Para devolver items en respuestas
class ItemOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    owner_id: int  # importante para saber quién es el dueño
    owner: Optional[ItemOwner] = None  # información del propietario

    class Config:
        orm_mode = True  # permite convertir automáticamente desde SQLAlchemy