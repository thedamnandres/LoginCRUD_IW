from pydantic import BaseModel, EmailStr


# Para registrar usuarios
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


# Para devolver información de un usuario
class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_superuser: bool

    class Config:
        orm_mode = True  # permite convertir automáticamente desde SQLAlchemy


# Para devolver el token de acceso tras el login
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str