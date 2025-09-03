<<<<<<< HEAD
from fastapi import APIRouter, HTTPException, Body, Depends
from typing import List
from sqlalchemy.orm import Session
from app.schemas.user import UserResponse, GetUser, UserUpdate
from app.service.user_service import UserService
from app.database import get_db
=======
from fastapi import APIRouter, HTTPException, Body
from typing import List
from app.schemas.user import UserResponse, GetUser, UserUpdate
from app.service.user_service import UserService, users_db
>>>>>>> c49effb5a8eb7d244a068ccfcdafad00369f6f15

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

# Criar usuário
@router.post("/", response_model=UserResponse)
<<<<<<< HEAD
def create_user(user: GetUser, db: Session = Depends(get_db)):
    try:
        return UserService.create_user(user.name, user.age, db)
=======
def create_user(user: GetUser):  # <-- Recebe um objeto User no corpo
    try:
        new_user = UserService.create_user(user.name, user.age)
        return new_user
>>>>>>> c49effb5a8eb7d244a068ccfcdafad00369f6f15
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Listar todos usuários
@router.get("/", response_model=List[UserResponse])
<<<<<<< HEAD
def list_users(db: Session = Depends(get_db)):
    return UserService.list_users(db)

# Pesquisar usuário por ID
@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    try:
        return UserService.get_user(user_id, db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

# Deletar usuário
@router.delete("/{user_id}")
def remove_user(user_id: int, db: Session = Depends(get_db)):
    try:
        return UserService.delete_user(user_id, db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

# Atualizar nome ou idade (PATCH)
@router.patch("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_update: UserUpdate = Body(...), db: Session = Depends(get_db)):
    try:
        return UserService.update_user(user_id, user_update, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Substituir usuário (PUT)
@router.put("/{user_id}", response_model=UserResponse)
def replace_user(user_id: int, payload: GetUser = Body(...), db: Session = Depends(get_db)):
    try:
        user = UserService.get_user(user_id, db)
        user.name = payload.name
        user.age = payload.age
        db.commit()
        db.refresh(user)
        return user
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
=======
def list_users():
    return users_db

# Pesquisar usuário por ID
@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int):
    user = next((u for u in users_db if u.id == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User não encontrado")
    return user

# Deletar usuário
@router.delete("/{user_id}")
def remove_user(user_id: int):
    success = UserService.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User não encontrado")
    return {"message": "Usuário removido com sucesso"}

# Atualizar nome ou idade
@router.patch("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_update: UserUpdate = Body(...)):
    updated_user = UserService.update_user(user_id, user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User não encontrado")
    return updated_user

@router.put("/{user_id}", response_model=UserResponse)
def replace_user(user_id: int, payload: GetUser = Body(...)):
    user = next((u for u in users_db if u.id == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User não encontrado")
    # PUT = substitui todo o recurso, por isso espera name e age
    user.name = payload.name
    user.age = payload.age
    return user
>>>>>>> c49effb5a8eb7d244a068ccfcdafad00369f6f15
