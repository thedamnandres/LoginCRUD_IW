from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine, SessionLocal
from app.models.user import User
from app.core.security import get_password_hash
from app.controllers import auth, item

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="FastAPI MVC Backend")

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Crear superusuario inicial si no existe
def init_admin():
    db = SessionLocal()
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        admin = User(
            username="admin",
            email="admin@example.com",
            hashed_password=get_password_hash("admin123"),
            is_superuser=True,
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        print("✅ Usuario admin creado (user: admin / pass: admin123)")
    db.close()


init_admin()

# Incluir routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(item.router, prefix="/items", tags=["Items"])