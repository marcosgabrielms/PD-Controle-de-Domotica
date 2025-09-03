# **L.E.M. Home - Frontend**

Este é o frontend da aplicação de controle de domótica L.E.M. Home. É uma aplicação de página única (SPA - Single Page Application) desenvolvida com **HTML, CSS e JavaScript puro**, focada em uma interface de usuário limpa, modular e de fácil manutenção para gerenciar uma casa inteligente.

## **✨ Funcionalidades**

* **Gerenciamento de Cômodos**: Crie, edite e exclua cômodos (ex: Sala de Estar, Cozinha).
* **Gerenciamento de Dispositivos**: Adicione e remova dispositivos (lâmpadas, ventiladores) em cada cômodo.
* **Controle de Dispositivos**: Ligue e desligue dispositivos individualmente com um clique.
* **Gerenciamento de Cenas**: Crie, edite e exclua cenas personalizadas (ex: "Modo Cinema").
* **Editor de Cenas Visual**: Configure a sequência de ações para cada cena, definindo a ordem, o dispositivo, a ação (ligar/desligar) e o intervalo de tempo entre as ações.
* **Login Simulado**: Um botão de "Login/Logout" simula um usuário autenticado, habilitando/desabilitando as funções de edição e exclusão.
* **Interface Reativa**: A UI é atualizada dinamicamente sem a necessidade de recarregar a página.

## **🚀 Como Executar**

Como este é um projeto de frontend com arquivos estáticos (HTML, CSS, JS), não há um processo de build complexo. A maneira mais fácil de executá-lo é usando um servidor web local.

**Usando a extensão Live Server (VS Code):**

1.  Certifique-se de ter a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) instalada no seu Visual Studio Code.
2.  Abra a pasta `frontend` no VS Code.
3.  Clique com o botão direito no arquivo `index.html`.
4.  Selecione "Open with Live Server".
5.  Seu navegador padrão abrirá automaticamente com a aplicação rodando.

## **📁 Estrutura do Projeto**

O código é organizado de forma modular para facilitar o entendimento e a manutenção.

```
frontend/
├── assets/
│   ├── css/
│   │   └── styles.css         # Folha de estilos principal
│   ├── js/
│   │   ├── app.js             # Ponto de entrada, "cérebro" da aplicação
│   │   ├── api/
│   │   │   ├── comodos.api.js     # Funções para interagir com a API de cômodos
│   │   │   ├── dispositivos.api.js# Funções para interagir com a API de dispositivos
│   │   │   ├── cenas.api.js      # Funções para interagir com a API de cenas
│   │   │   ├── index.js         # Agrega todos os módulos da API
│   │   │   └── store.js         # SIMULAÇÃO de um banco de dados em memória
│   │   └── ui/
│   │       ├── dashboard.js     # Lógica para renderizar o dashboard
│   │       ├── roomDetails.js   # Lógica para renderizar os detalhes de um cômodo
│   │       ├── sceneEditor.js   # Lógica para renderizar o editor de cenas
│   │       ├── dom.js           # Centraliza a seleção de elementos do DOM
│   │       ├── modals.js        # Funções para controlar os modais
│   │       └── navigation.js    # Funções para alternar entre as "telas"
│   └── imagens/                 # Ícones e imagens utilizados na UI
└── index.html                 # Estrutura principal da aplicação

```

## **⚙️ Como Funciona**

A aplicação funciona com base em três pilares principais:

1.  **UI (Interface do Usuário)**: Os módulos dentro de `assets/js/ui/` são responsáveis por desenhar e atualizar o HTML dinamicamente. Eles pegam os dados e os transformam nos cards e listas que você vê na tela.

2.  **API (Camada de Comunicação)**: Os módulos em `assets/js/api/` servem como uma ponte entre a UI e os dados. Atualmente, eles buscam e salvam informações no `store.js`, que atua como um backend simulado.

3.  **App Controller (`app.js`)**: Este arquivo centraliza tudo. Ele escuta os cliques do usuário, chama as funções da API para obter os dados necessários e, em seguida, chama as funções da UI para renderizar a tela apropriada com esses dados.

### **Backend Simulado**

Para permitir um desenvolvimento rápido e independente, o frontend utiliza um backend simulado localizado em `assets/js/api/store.js`. Isso significa que a aplicação é totalmente funcional por conta própria, sem a necessidade de rodar o servidor FastAPI.

Para conectar ao backend real, basta modificar os métodos nos arquivos dentro de `assets/js/api/` (ex: `comodos.api.js`) para usar a **Fetch API** em vez de acessar o `store.js`. A estrutura modular garante que **nenhuma outra parte do código precisará ser alterada**.