# 📄 Documentação da API REST - Controle de Domótica

**Base URL:** `/api/v1`

---

## 1. Cômodos

### Listar todos os cômodos

- **Method:** `GET`
- **URL:** `/comodos`
- **Parâmetros:** Nenhum
- **Resposta:**
  ```json
  [
    { "id": 1, "nome": "Sala de Estar" },
    { "id": 2, "nome": "Quarto Principal" }
  ]
  ```
- **Status Codes:** `200 OK`

---

### Criar um novo cômodo

- **Method:** `POST`
- **URL:** `/comodos`
- **Corpo da Requisição:**
  ```json
  { "nome": "Cozinha" }
  ```
- **Resposta:**
  ```json
  { "id": 3, "nome": "Cozinha" }
  ```
- **Status Codes:** `201 Created`, `400 Bad Request`

---

## 2. Dispositivos

### Listar dispositivos de um cômodo

- **Method:** `GET`
- **URL:** `/comodos/{id}/dispositivos`
- **Parâmetros de URL:**  
  - `id` (integer): ID do cômodo
- **Resposta:**
  ```json
  [
    { "id": 101, "nome": "Lâmpada Principal", "estado": false, "comodoId": 1 },
    { "id": 102, "nome": "Ventilador de Teto", "estado": true, "comodoId": 1 }
  ]
  ```
- **Status Codes:** `200 OK`, `404 Not Found`

---

### Adicionar um novo dispositivo

- **Method:** `POST`
- **URL:** `/dispositivos`
- **Corpo da Requisição:**
  ```json
  { "nome": "Tomada Inteligente", "comodoId": 1 }
  ```
- **Resposta:**
  ```json
  { "id": 103, "nome": "Tomada Inteligente", "estado": false, "comodoId": 1 }
  ```
- **Status Codes:** `201 Created`, `400 Bad Request`, `404 Not Found`

---

### Alterar estado de um dispositivo

- **Method:** `PATCH`
- **URL:** `/dispositivos/{id}/estado`
- **Parâmetros de URL:**  
  - `id` (integer): ID do dispositivo
- **Corpo da Requisição:**
  ```json
  { "estado": true }
  ```
- **Resposta:**
  ```json
  { "id": 102, "nome": "Ventilador de Teto", "estado": true, "comodoId": 1 }
  ```
- **Status Codes:** `200 OK`, `400 Bad Request`, `404 Not Found`

---

### Remover um dispositivo

- **Method:** `DELETE`
- **URL:** `/dispositivos/{id}`
- **Parâmetros de URL:**  
  - `id` (integer): ID do dispositivo
- **Resposta:** Corpo vazio
- **Status Codes:** `204 No Content`, `404 Not Found`

---

## 3. Cenas

### Listar todas as cenas

- **Method:** `GET`
- **URL:** `/cenas`
- **Resposta:**
  ```json
  [
    {
      "id": 1,
      "nome": "Modo Cinema",
      "ativa": true,
      "acoes": [
        {
          "id": 1,
          "ordem": 1,
          "intervaloSegundos": 0,
          "dispositivoId": 101,
          "estadoDesejado": false
        }
      ]
    }
  ]
  ```
- **Status Codes:** `200 OK`

---

### Criar uma nova cena

- **Method:** `POST`
- **URL:** `/cenas`
- **Corpo da Requisição:**
  ```json
  { "nome": "Bom Dia", "ativa": true }
  ```
- **Resposta:**
  ```json
  { "id": 2, "nome": "Bom Dia", "ativa": true, "acoes": [] }
  ```
- **Status Codes:** `201 Created`, `400 Bad Request`

---

### Adicionar ação a uma cena

- **Method:** `POST`
- **URL:** `/cenas/{id}/acoes`
- **Parâmetros de URL:**  
  - `id` (integer): ID da cena
- **Corpo da Requisição:**
  ```json
  {
    "dispositivoId": 101,
    "estadoDesejado": true,
    "ordem": 1,
    "intervaloSegundos": 5
  }
  ```
- **Resposta:**  
  Retorna o objeto da ação criada.
- **Status Codes:** `201 Created`, `400 Bad Request`, `404 Not Found`

---

### Ativar uma cena

- **Method:** `POST`
- **URL:** `/cenas/{id}/ativar`
- **Parâmetros de URL:**  
  - `id` (integer): ID da cena
- **Resposta:**
  ```json
  { "message": "Cena 'Modo Cinema' ativada com sucesso." }
  ```
- **Status Codes:** `200 OK`, `404 Not Found`

---

## 4. Códigos de Status Comuns

- `200 OK`: Sucesso na requisição.
- `201 Created`: Recurso criado com sucesso.
- `204 No Content`: Sucesso, sem conteúdo para retornar.
- `400 Bad Request`: Erro de validação ou requisição malformada.
- `404 Not Found`: Recurso não encontrado.
- `500 Internal Server Error`: Erro inesperado no servidor.

---

