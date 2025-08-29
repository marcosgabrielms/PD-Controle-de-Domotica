// ===================================================================================
// SIMULAÇÃO DO BACKEND (API)
// ===================================================================================
const api = {
    _data: {
        comodos: [
            { id: 1, nome: "Sala de Estar" }, { id: 2, nome: "Quarto Principal" }, { id: 3, nome: "Cozinha" },
        ],
        dispositivos: [
            { id: 1, comodo_id: 1, nome: "Lâmpada Principal", estado: false },
            { id: 2, comodo_id: 1, nome: "Abajur", estado: true },
            { id: 3, comodo_id: 2, nome: "Ventilador de Teto", estado: false },
        ],
        cenas: [{
            id: 1, nome: "Boa Noite", ativo: true,
            acoes: [
                { dispositivo_id: 1, acao_estado: false, ordem: 1, intervalo_segundos: 0 },
                { dispositivo_id: 2, acao_estado: false, ordem: 2, intervalo_segundos: 1 },
                { dispositivo_id: 3, acao_estado: true, ordem: 3, intervalo_segundos: 2 },
            ]
        }]
    },
    _nextId: { comodo: 4, dispositivo: 4, cena: 2 },
    // Funções de Cômodos e Dispositivos (código existente)
    async getComodos() { return structuredClone(this._data.comodos); },
    async getComodoById(id) { return this._data.comodos.find(c => c.id === id); },
    async createComodo(nome) { const n = { id: this._nextId.comodo++, nome }; this._data.comodos.push(n); return n; },
    async updateComodo(id, nome) { const c = this._data.comodos.find(c => c.id === id); if (c) c.nome = nome; return c; },
    async deleteComodo(id) { this._data.comodos = this._data.comodos.filter(c => c.id !== id); return { success: true }; },
    async getAllDispositivos() { return structuredClone(this._data.dispositivos); },
    async getDispositivosByComodoId(comodoId) { return this._data.dispositivos.filter(d => d.comodo_id === comodoId); },
    async getDispositivoById(id) { return this._data.dispositivos.find(d => d.id === id); },
    async createDispositivo(nome, comodo_id) { const n = { id: this._nextId.dispositivo++, comodo_id, nome, estado: false }; this._data.dispositivos.push(n); return n; },
    async updateDispositivo(id, nome) { const d = this._data.dispositivos.find(d => d.id === id); if (d) d.nome = nome; return d; },
    async toggleDispositivoState(id) { const d = this._data.dispositivos.find(d => d.id === id); if (d) d.estado = !d.estado; return d; },
    async deleteDispositivo(id) { this._data.dispositivos = this._data.dispositivos.filter(d => d.id !== id); return { success: true }; },
    
    // --- Funções de Cenas ---
    async getCenas() { return structuredClone(this._data.cenas); },
    async getCenaById(id) { return structuredClone(this._data.cenas.find(s => s.id === id)); },
    async saveScene(sceneData) {
        if (sceneData.id) { // Atualiza
            const index = this._data.cenas.findIndex(s => s.id === sceneData.id);
            if (index > -1) this._data.cenas[index] = sceneData;
        } else { // Cria
            const novaCena = { ...sceneData, id: this._nextId.cena++, ativo: true };
            this._data.cenas.push(novaCena);
        }
        return { success: true };
    },
    async deleteScene(id) { this._data.cenas = this._data.cenas.filter(s => s.id !== id); return { success: true }; },
    async executeScene(id) {
        const cena = this._data.cenas.find(s => s.id === id);
        if (!cena) return { success: false };
        console.log(`EXECUTANDO CENA: ${cena.nome}`);
        for (const acao of cena.acoes.sort((a,b) => a.ordem - b.ordem)) {
             const dispositivo = this._data.dispositivos.find(d => d.id === acao.dispositivo_id);
             if (dispositivo) {
                console.log(`Ação: ${acao.acao_estado ? 'Ligar' : 'Desligar'} ${dispositivo.nome} após ${acao.intervalo_segundos}s`);
                dispositivo.estado = acao.acao_estado;
             }
        }
        return { success: true };
    }
};

// ===================================================================================
// LÓGICA DO FRONT-END
// ===================================================================================
document.addEventListener('DOMContentLoaded', () => {
    // --- ESTADO GLOBAL DO APP ---
    let currentRoomId = null;
    let currentSceneId = null;
    let allDevicesCache = []; // Cache para não buscar dispositivos toda hora

    // --- ELEMENTOS DO DOM ---
    const views = {
        dashboard: document.getElementById('view-dashboard'),
        roomDetails: document.getElementById('view-room-details'),
        sceneEditor: document.getElementById('view-scene-editor'),
    };
    const comodosGrid = document.getElementById('comodos-grid');
    const cenasList = document.getElementById('cenas-list');
    const modalBackdrop = document.getElementById('modal-backdrop');
    // ...outros elementos...

    // --- FUNÇÕES DE NAVEGAÇÃO E MODAL ---
    function showView(viewName) {
        Object.values(views).forEach(view => view.classList.add('hidden'));
        if (views[viewName]) views[viewName].classList.remove('hidden');
    }
    // ...funções de modal existentes...

    // --- FUNÇÕES DE RENDERIZAÇÃO ---
    async function renderDashboard() {
        // Renderiza Cômodos
        const comodos = await api.getComodos();
        comodosGrid.innerHTML = '';
        comodos.forEach(comodo => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.comodoId = comodo.id;
            card.innerHTML = `
                <div class="card-body">
                    <h4 class="card-title">${comodo.nome}</h4>
                    <p class="card-content">Gerenciar dispositivos</p>
                </div>
                <div class="card-actions">
                    <button class="btn-icon btn-edit-comodo" data-comodo-id="${comodo.id}"><i class="fas fa-pencil-alt"></i></button>
                    <button class="btn-icon btn-danger btn-delete-comodo" data-comodo-id="${comodo.id}"><i class="fas fa-trash"></i></button>
                </div>`;
            comodosGrid.appendChild(card);
        });

        // Renderiza Cenas
        const cenas = await api.getCenas();
        cenasList.innerHTML = '';
        cenas.forEach(cena => {
            const item = document.createElement('div');
            item.className = 'scene-item';
            item.innerHTML = `
                <span class="scene-item-name">${cena.nome}</span>
                <div class="scene-item-actions">
                    <button class="btn-executar-cena" data-scene-id="${cena.id}"><i class="fas fa-play"></i> Executar</button>
                    <button class="btn-icon btn-edit-cena" data-scene-id="${cena.id}"><i class="fas fa-pencil-alt"></i></button>
                    <button class="btn-icon btn-danger btn-delete-cena" data-scene-id="${cena.id}"><i class="fas fa-trash"></i></button>
                </div>`;
            cenasList.appendChild(item);
        });

        showView('dashboard');
    }

    async function renderRoomDetails(comodoId) { /* ...código existente... */ }
    
    // Renderiza o Editor de Cenas
    async function renderSceneEditor(sceneId = null) {
        currentSceneId = sceneId;
        const editor = document.getElementById('view-scene-editor');
        const form = editor.querySelector('#form-scene');
        const title = editor.querySelector('#scene-editor-title');
        const nameInput = editor.querySelector('#input-scene-name');
        const idInput = editor.querySelector('#input-scene-id');
        const actionsList = editor.querySelector('#scene-actions-list');
        
        form.reset();
        actionsList.innerHTML = '<h3>Sequência de Ações</h3>'; // Limpa ações anteriores

        allDevicesCache = await api.getAllDispositivos(); // Garante que temos a lista de dispositivos

        if (sceneId) {
            const cena = await api.getCenaById(sceneId);
            title.textContent = `Editar Cena: ${cena.nome}`;
            nameInput.value = cena.nome;
            idInput.value = cena.id;
            cena.acoes.forEach(acao => addActionToDOM(acao));
        } else {
            title.textContent = "Criar Nova Cena";
        }
        showView('sceneEditor');
    }
    
    // Helper para adicionar uma ação ao DOM no editor
    function addActionToDOM(action = {}) {
        const actionsList = document.getElementById('scene-actions-list');
        const actionCard = document.createElement('div');
        actionCard.className = 'action-card';
        
        const deviceOptions = allDevicesCache.map(d => `<option value="${d.id}" ${action.dispositivo_id === d.id ? 'selected' : ''}>${d.nome}</option>`).join('');
        
        actionCard.innerHTML = `
            <div class="action-card-header">
                <h4>Passo</h4>
                <button type="button" class="btn-icon btn-danger btn-remove-action"><i class="fas fa-trash"></i></button>
            </div>
            <div class="action-card-body">
                <select class="action-device">${deviceOptions}</select>
                <select class="action-state">
                    <option value="true" ${action.acao_estado === true ? 'selected' : ''}>Ligar</option>
                    <option value="false" ${action.acao_estado === false ? 'selected' : ''}>Desligar</option>
                </select>
                <input type="number" class="action-interval" min="0" value="${action.intervalo_segundos || 0}" title="Atraso em segundos">
            </div>`;
        actionsList.appendChild(actionCard);
    }

    // --- MANIPULADORES DE EVENTOS ---
    
    // Delegação de eventos no Dashboard
    views.dashboard.addEventListener('click', async (e) => {
        const btnCreateScene = e.target.closest('#btn-goto-scene-editor-new');
        const btnExecuteScene = e.target.closest('.btn-executar-cena');
        const btnEditScene = e.target.closest('.btn-edit-cena');
        const btnDeleteScene = e.target.closest('.btn-delete-cena');

        if (btnCreateScene) { renderSceneEditor(); }
        else if (btnExecuteScene) {
            const sceneId = parseInt(btnExecuteScene.dataset.sceneId);
            await api.executeScene(sceneId);
            alert('Cena executada! Verifique o console para ver as ações.');
            renderDashboard(); // Re-renderiza para mostrar estados atualizados (em um app real)
        }
        else if (btnEditScene) { renderSceneEditor(parseInt(btnEditScene.dataset.sceneId)); }
        else if (btnDeleteScene) {
            const sceneId = parseInt(btnDeleteScene.dataset.sceneId);
            if (confirm("Tem certeza que deseja excluir esta cena?")) {
                await api.deleteScene(sceneId);
                renderDashboard();
            }
        }
        // ...outros eventos do dashboard...
    });
    
    // Delegação de eventos no Editor de Cenas
    views.sceneEditor.addEventListener('click', (e) => {
        const btnAddAction = e.target.closest('#btn-add-action');
        const btnRemoveAction = e.target.closest('.btn-remove-action');

        if (btnAddAction) { addActionToDOM(); }
        else if (btnRemoveAction) { btnRemoveAction.closest('.action-card').remove(); }
    });
    
    // Submit do formulário de Cena
    document.getElementById('form-scene').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('input-scene-id').value;
        const sceneData = {
            id: id ? parseInt(id) : null,
            nome: document.getElementById('input-scene-name').value,
            acoes: []
        };
        
        document.querySelectorAll('#scene-actions-list .action-card').forEach((card, index) => {
            sceneData.acoes.push({
                ordem: index + 1,
                dispositivo_id: parseInt(card.querySelector('.action-device').value),
                acao_estado: card.querySelector('.action-state').value === 'true',
                intervalo_segundos: parseInt(card.querySelector('.action-interval').value)
            });
        });

        await api.saveScene(sceneData);
        renderDashboard();
    });

    // ...outros listeners existentes...
    views.roomDetails.addEventListener('click', (e) => { /* ...código existente... */ });
    
    // --- INICIALIZAÇÃO ---
    function init() { renderDashboard(); }
    init();
});