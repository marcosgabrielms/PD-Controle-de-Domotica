from typing import List, Optional
from app.schemas.user import UserResponse, UserUpdate

# Banco de dados fictício em memória
users_db: List[UserResponse] = []
current_id = 0  # Contador global para IDs

class UserService:

    @staticmethod
    def create_user(name: str, age: int) -> UserResponse:
        """
        Cria uma autenticação para o usuário com um ID numérico único.
        """
        global current_id
        current_id += 1  # Incrementa o ID

        new_user = UserResponse(
            id=current_id,  # ID numérico único
            name=name,
            age=age
        )

        users_db.append(new_user)  # Simula salvar no "banco"
        return new_user
    
    @staticmethod
    def delete_user(user_id: int) -> bool:
        """
        Remove um usuário pelo ID.
        Retorna True se o usuário foi removido, False se não encontrado.
        """
        global users_db
        user = next((u for u in users_db if u.id == user_id), None)
        if not user:
            return False
        users_db = [u for u in users_db if u.id != user_id]
        return True
    
    @staticmethod
    def update_user(user_id: int, data: UserUpdate) -> Optional[UserResponse]:
        user = next((u for u in users_db if u.id == user_id), None)
        if not user:
            return None

        # validações simples (opcional)
        if data.name is not None and not data.name.strip():
            raise ValueError("Nome não pode ser vazio.")
        if data.age is not None and data.age < 0:
            raise ValueError("Idade não pode ser negativa.")

        # aplica somente o que veio
        if data.name is not None:
            user.name = data.name
        if data.age is not None:
            user.age = data.age

        return user
