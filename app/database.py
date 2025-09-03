import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()  
Base = declarative_base()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")


SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

try:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

    with engine.connect() as conn:
        print("Conexão com o banco de dados bem-sucedida!")
except Exception as e:
    print("Erro ao se conectar ao banco de dados:", e)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Para injeção no FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
    
def init_db():
    from app.models import user, room, device, scene  # importa os models
    Base.metadata.create_all(bind=engine)