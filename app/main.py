from fastapi import FastAPI
from app.routers.user_router import router as user_router
from app.routers.room_router import router as room_router
from app.routers.scene_router import router as scene_router
from app.routers.device_router import router as device_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Intelligence Home API")

origins = [
    "http://127.0.0.1:5500", # Endereço padrão do Live Server no VS Code
    "http://localhost:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Permite as origens da lista
    allow_credentials=True,
    allow_methods=["*"],         # Permite todos os métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],         # Permite todos os cabeçalhos
)

# Incluindo routers
app.include_router(user_router)
app.include_router(room_router)
app.include_router(scene_router)
app.include_router(device_router)

@app.get("/")
def root():
    return {"message": "API rodando!"}