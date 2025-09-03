from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserUpdate

class UserService:

    @staticmethod
    def create_user(name: str, age: int, db: Session) -> User:
        new_user = User(name=name, age=age)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    @staticmethod
    def get_user(user_id: int, db: Session) -> User:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("Usuário não encontrado")
        return user

    @staticmethod
    def list_users(db: Session):
        return db.query(User).all()

    @staticmethod
    def delete_user(user_id: int, db: Session):
        user = UserService.get_user(user_id, db)
        db.delete(user)
        db.commit()
        return {"message": "Usuário removido com sucesso"}

    @staticmethod
    def update_user(user_id: int, data: UserUpdate, db: Session) -> User:
        user = UserService.get_user(user_id, db)

        if data.name is not None:
            if not data.name.strip():
                raise ValueError("Nome não pode ser vazio.")
            user.name = data.name
        if data.age is not None:
            if data.age < 0:
                raise ValueError("Idade não pode ser negativa.")
            user.age = data.age

        db.commit()
        db.refresh(user)
        return user
