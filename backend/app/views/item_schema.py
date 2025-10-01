from pydantic import BaseModel
from typing import Optional


# Para crear o actualizar items
class ItemCreate(BaseModel):
    name: str
    description: Optional[str] = None


# Para devolver items en respuestas
class ItemOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    owner_id: int  # importante para saber quién es el dueño

    class Config:
        orm_mode = True  # permite convertir automáticamente desde SQLAlchemy