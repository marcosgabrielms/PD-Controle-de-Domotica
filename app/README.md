# **InteligenceHome API**

Este projeto é uma API para gerenciamento de uma casa inteligente, desenvolvida com **FastAPI** e PostgreSQL.

O sistema permite gerenciar **cômodos, dispositivos, cenas** e usuários.

---

## **Pré-requisitos**

* Python 3.10 ou superior
* PostgreSQL instalado
* Git (opcional, para clonar o repositório)

---

## **1️⃣ Criar e ativar o ambiente virtual**

Crie um ambiente virtual para isolar as dependências do projeto:

Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

Linux / macOS:

```bash
python3 -m venv venv
source venv/bin/activate
```

## **2️⃣ Instalar as dependências**

Dentro do ambiente virtual ativo, instale todas as bibliotecas necessárias:

```bash
pip install -r requirements.txt
```

## **3️⃣ Configurar o banco de dados PostgreSQL**

Aqui está um exemplo de sessão de conexão com o banco de dados para colocar no `README`, usando apenas comandos:

---

### **Configuração do Banco de Dados PostgreSQL**

1. **Crie o arquivo `.env`** na raiz do projeto (fora de app) com as variáveis de ambiente:

```
DB_USER=postgres
DB_PASSWORD=senha_do_postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=intelligence_home
```

2. **Abra o terminal do PostgreSQL:**

```bash
psql -U postgres
```

3. **Crie o banco de dados:**

```sql
CREATE DATABASE intelligence_home;
```

4. **Verifique se o banco foi criado:**

```sql
\l
```

5. **Saia do PostgreSQL:**

```sql
\q
```

6. **Rode as migrations ou crie as tabelas usando o SQLAlchemy (ou comando equivalente do seu projeto):**

```bash
python -m app.database
```

## **4️⃣ Rodar a API**

Com o ambiente virtual ativo, rode o servidor de desenvolvimento:

```bash
fastapi dev main.py
```

* Acesse a API em: `http://127.0.0.1:8000`
* Documentação automática do Swagger: `http://127.0.0.1:8000/docs`
* Documentação Redoc: `http://127.0.0.1:8000/redoc`

---

## **5️⃣ Testar a API / Insomnia / Postman**

### Swagger UI

- *Link:* [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Interface interativa para visualizar rotas da API 
- Testar requisições `GET`, `POST`, `PUT`, `DELETE`
- Ver exemplos de entrada e saída de dados

### ReDoc

- *Link:*[http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc) 
- Interface estrutura e organizada, que apresenta a estrutura da API, sem testar rotas
- Mostrar campos de entrada e saída

* **Listar cômodos**: `GET /rooms/`
* **Criar cômodo**: `POST /rooms/` com JSON:

```json
{
  "name": "Sala de Estar"
}
```

* **Adicionar dispositivos**: `POST /rooms/{room_id}/devices/`

> Ajuste os endpoints conforme seus routers (`user_router`, `room_router`, etc.).

---

## **6️⃣ Boas práticas de segurança**

* Nunca coloque usuário/senha do banco no GitHub.
* Use arquivos `.env` e a biblioteca `python-dotenv` para carregar variáveis de ambiente.
* Para produção, configure o PostgreSQL e FastAPI com autenticação adequada e HTTPS.

---

## ** Rotas da API**

SmartHome API
 ├── Users
 │    ├── POST /users/ (Create User)
 │    └── GET /users/ (List Users)
 ├── Rooms
 │    ├── POST /rooms/ (Create Room)
 │    ├── GET /rooms/ (List Rooms)
 │    ├── POST /rooms/{room_id}/devices (Add Devices to Room)
 │    ├── DELETE /rooms/{room_id}/devices (Remove Devices from Room)
 │    └── POST /rooms/{room_id}/scenes (Create Scene in Room)
 ├── Scenes
 │    ├── POST /scenes/ (Create Scene)
 │    ├── GET /scenes/ (List Scenes)
 │    ├── POST /scenes/{scene_id}/devices (Add Devices to Scene)
 │    ├── DELETE /scenes/{scene_id}/devices (Remove Devices from Scene)
 │    ├── POST /scenes/{scene_id}/activate (Activate Scene)
 │    └── POST /scenes/{scene_id}/deactivate (Deactivate Scene)
 └── Devices
      ├── POST /devices/ (Create Device)
      ├── GET /devices/ (List Devices)
      ├── POST /devices/{device_id}/toggle (Toggle Device)
      └── DELETE /devices/{device_id} (Remove Device)
