from fastapi import FastAPI
from app.routers.user_router import router as user_router
from app.routers.room_router import router as room_router
from app.routers.scene_router import router as scene_router
from app.routers.device_router import router as device_router
from app.database import init_db

app = FastAPI(title="Intelligence Home API")


# Incluindo routers
app.include_router(user_router)
app.include_router(room_router)
app.include_router(scene_router)
app.include_router(device_router)

@app.get("/")
def root():
    return {"message": "API rodando!"}

init_db() 