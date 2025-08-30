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
        },
        {
            id: 2, nome: "Noite de Cinema", ativo: true,
            acoes: [
                { dispositivo_id: 1, acao_estado: true, ordem: 1, intervalo_segundos: 0 },
                { dispositivo_id: 2, acao_estado: false, ordem: 2, intervalo_segundos: 1 },
            ]
        }]
    },
    _nextId: { comodo: 4, dispositivo: 4, cena: 3 },
    async getComodos() { return structuredClone(this._data.comodos); },
    async getComodoById(id) { return this._data.comodos.find(c => c.id === id); },
    async createComodo(nome) { const n = { id: this._nextId.comodo++, nome }; this._data.comodos.push(n); return n; },
    async updateComodo(id, nome) { const c = this._data.comodos.find(c => c.id === id); if (c) c.nome = nome; return c; },
    async deleteComodo(id) {
        const dispositivosNoComodo = this._data.dispositivos.filter(d => d.comodo_id === id);
        const dispositivoIds = dispositivosNoComodo.map(d => d.id);
        if (dispositivoIds.length > 0) {
            this._data.cenas = this._data.cenas.filter(cena =>
                !cena.acoes.some(acao => dispositivoIds.includes(acao.dispositivo_id))
            );
        }
        this._data.comodos = this._data.comodos.filter(c => c.id !== id);
        return { success: true };
    },
    async getAllDispositivos() { return structuredClone(this._data.dispositivos); },
    async getDispositivosByComodoId(comodoId) { return this._data.dispositivos.filter(d => d.comodo_id === comodoId); },
    async createDispositivo(nome, comodo_id) { const n = { id: this._nextId.dispositivo++, comodo_id, nome, estado: false }; this._data.dispositivos.push(n); return n; },
    async toggleDispositivoState(id) { const d = this._data.dispositivos.find(d => d.id === id); if (d) d.estado = !d.estado; return d; },
    async deleteDispositivo(id) {
        this._data.cenas = this._data.cenas.filter(cena => !cena.acoes.some(acao => acao.dispositivo_id === id));
        this._data.dispositivos = this._data.dispositivos.filter(d => d.id !== id);
        return { success: true };
    },
    async getCenas() { return structuredClone(this._data.cenas); },
    async getCenaById(id) { return structuredClone(this._data.cenas.find(s => s.id === id)); },
    async saveScene(sceneData) {
        if (sceneData.id) {
            const index = this._data.cenas.findIndex(s => s.id === sceneData.id);
            if (index > -1) {
                const cenaExistente = this._data.cenas[index];
                this._data.cenas[index] = { ...cenaExistente, ...sceneData };
            }
        } else {
            const novaCena = { ...sceneData, id: this._nextId.cena++, ativo: true };
            this._data.cenas.push(novaCena);
        }
        return { success: true };
    },
    async deleteScene(id) { this._data.cenas = this._data.cenas.filter(s => s.id !== id); return { success: true }; },
    async executeScene(id) {
        const cena = this._data.cenas.find(s => s.id === id);
        if (!cena || !cena.ativo) return { success: false };
        console.log(`EXECUTANDO CENA: ${cena.nome}`);
        for (const acao of cena.acoes.sort((a,b) => a.ordem - b.ordem)) {
            const dispositivo = this._data.dispositivos.find(d => d.id === acao.dispositivo_id);
            if (dispositivo) {
                setTimeout(() => { dispositivo.estado = acao.acao_estado; }, acao.intervalo_segundos * 1000);
            }
        }
        return { success: true };
    },
    async toggleSceneActiveState(id) { const c = this._data.cenas.find(s => s.id === id); if (c) { c.ativo = !c.ativo; } return c; }
};

// ===================================================================================
// LÓGICA DO FRONT-END
// ===================================================================================
document.addEventListener('DOMContentLoaded', () => {
    // --- ESTADO GLOBAL DO APP ---
    let currentRoomId = null;
    let usuarioLogado = false;
    let allDevicesCache = [];

    // --- ELEMENTOS DO DOM ---
    const views = {
        dashboard: document.getElementById('view-dashboard'),
        roomDetails: document.getElementById('view-room-details'),
        sceneEditor: document.getElementById('view-scene-editor'),
    };
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalComodo = document.getElementById('modal-comodo');
    const modalDevice = document.getElementById('modal-device');
    const formComodo = document.getElementById('form-comodo');
    const formDevice = document.getElementById('form-device');
    const formScene = document.getElementById('form-scene');
    const btnToggleLogin = document.getElementById('btn-toggle-login');

    // --- FUNÇÕES DE NAVEGAÇÃO E MODAL ---
    function showView(viewName) {
        Object.values(views).forEach(view => view.classList.add('hidden'));
        if (views[viewName]) views[viewName].classList.remove('hidden');
    }
    function showModal(modalElement) {
        modalBackdrop.classList.remove('hidden');
        modalElement.classList.remove('hidden');
    }
    function hideModals() {
        modalBackdrop.classList.add('hidden');
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    }

    // --- FUNÇÕES DE ATUALIZAÇÃO DE UI ---
    function updateLoginUI() {
        const loginStatusIcon = document.getElementById('login-status-icon');
        const loginStatusText = document.getElementById('login-status-text');
        if (usuarioLogado) {
            loginStatusIcon.className = 'status-icon logged-in';
            loginStatusIcon.title = "Você está logado.";
            loginStatusText.textContent = "Logado";
        } else {
            loginStatusIcon.className = 'status-icon logged-out';
            loginStatusIcon.title = "Você está deslogado.";
            loginStatusText.textContent = "Deslogado";
        }
    }
    function updateButtonStates(hasRooms) {
        document.getElementById('btn-show-add-comodo-modal').disabled = !usuarioLogado;
        const btnCreateCena = document.getElementById('btn-goto-scene-editor-new');
        if (usuarioLogado && hasRooms) {
            btnCreateCena.disabled = false;
            btnCreateCena.title = "Criar uma nova cena";
        } else {
            btnCreateCena.disabled = true;
            btnCreateCena.title = !usuarioLogado ? "Faça o login para criar uma cena." : "Adicione um cômodo antes de criar uma cena.";
        }
    }

    // --- FUNÇÕES DE RENDERIZAÇÃO ---
    async function renderDashboard() {
        const comodos = await api.getComodos();
        const comodosGrid = document.getElementById('comodos-grid');
        comodosGrid.innerHTML = '';
        comodos.forEach(comodo => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-body">
                    <h4 class="card-title">${comodo.nome}</h4>
                    <div class="card-link" data-comodo-id="${comodo.id}" title="Ver detalhes de ${comodo.nome}">
                        <span>Gerenciar Dispositivos</span>
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn-icon btn-edit-comodo" data-comodo-id="${comodo.id}" title="Editar nome"><i class="fas fa-pencil-alt"></i></button>
                    <button class="btn-icon btn-danger btn-delete-comodo" data-comodo-id="${comodo.id}" title="Excluir cômodo"><i class="fas fa-trash"></i></button>
                </div>`;
            comodosGrid.appendChild(card);
        });

        const cenas = await api.getCenas();
        document.getElementById('cenas-list').innerHTML = cenas.map(cena => `
            <div class="scene-item">
                <span class="scene-item-name">${cena.nome}</span>
                <div class="scene-item-actions">
                    <label class="switch" title="${cena.ativo ? 'Desativar' : 'Ativar'} cena">
                        <input type="checkbox" class="toggle-scene-active" data-scene-id="${cena.id}" ${cena.ativo ? 'checked' : ''} ${!usuarioLogado ? 'disabled' : ''}>
                        <span class="slider"></span>
                    </label>
                    <button class="btn-executar-cena" data-scene-id="${cena.id}" ${!cena.ativo ? 'disabled' : ''}><i class="fas fa-play"></i> Executar</button>
                    <button class="btn-icon btn-edit-cena" data-scene-id="${cena.id}"><i class="fas fa-pencil-alt"></i></button>
                    <button class="btn-icon btn-danger btn-delete-cena" data-scene-id="${cena.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>`).join('');
        
        updateLoginUI();
        updateButtonStates(comodos.length > 0);
        showView('dashboard');
    }

    async function renderRoomDetails(comodoId) {
        currentRoomId = comodoId;
        const comodo = await api.getComodoById(comodoId);
        if (!comodo) { return renderDashboard(); }
        
        document.getElementById('room-details-name').textContent = comodo.nome;
        document.getElementById('btn-show-add-device-modal').disabled = !usuarioLogado;
        document.getElementById('btn-create-scene-from-room').disabled = !usuarioLogado;

        const devices = await api.getDispositivosByComodoId(comodoId);
        const devicesGrid = document.getElementById('devices-grid');
        devicesGrid.innerHTML = devices.length === 0 ? '<p>Nenhum dispositivo neste cômodo ainda.</p>' :
            devices.map(device => `
            <div class="device-card">
                <div class="device-card-header">
                    <span>${device.nome}</span>
                    <button class="btn-icon btn-danger btn-delete-device" data-device-id="${device.id}"><i class="fas fa-trash"></i></button>
                </div>
                <div class="device-card-actions">
                    <span class="status ${device.estado ? 'on' : ''}">${device.estado ? 'Ligado' : 'Desligado'}</span>
                    <button class="btn-toggle-device" data-device-id="${device.id}">${device.estado ? 'Desligar' : 'Ligar'}</button>
                </div>
            </div>`).join('');
        
        const allScenes = await api.getCenas();
        const deviceIdsInRoom = devices.map(d => d.id);
        const relatedScenes = allScenes.filter(scene => scene.acoes.some(acao => deviceIdsInRoom.includes(acao.dispositivo_id)));
        const relatedScenesList = document.getElementById('related-scenes-list');
        relatedScenesList.innerHTML = relatedScenes.length === 0 ? '<p>Nenhuma cena controla dispositivos neste cômodo.</p>' :
            relatedScenes.map(cena => `
            <div class="scene-item">
                <span class="scene-item-name">${cena.nome}</span>
                <span>${cena.ativo ? 'Ativa' : 'Inativa'}</span>
            </div>`).join('');
        
        showView('roomDetails');
    }
    
    async function renderSceneEditor(sceneId = null, fromRoomId = null) {
        formScene.reset();
        document.getElementById('input-scene-id').value = '';
        const actionsList = document.getElementById('scene-actions-list');
        actionsList.innerHTML = '<h3>Sequência de Ações</h3>';
        
        allDevicesCache = await api.getAllDispositivos();
        if (allDevicesCache.length === 0) {
            alert("É preciso ter ao menos um dispositivo cadastrado para criar uma cena.");
            return;
        }

        if (sceneId) {
            const cena = await api.getCenaById(sceneId);
            document.getElementById('scene-editor-title').textContent = `Editar Cena: ${cena.nome}`;
            document.getElementById('input-scene-id').value = cena.id;
            document.getElementById('input-scene-name').value = cena.nome;
            cena.acoes.sort((a,b) => a.ordem - b.ordem).forEach(acao => addActionToDOM(acao));
        } else {
            document.getElementById('scene-editor-title').textContent = "Criar Nova Cena";
        }
        
        if (fromRoomId) {
            const devicesInRoom = allDevicesCache.filter(d => d.comodo_id === fromRoomId);
            if (devicesInRoom.length > 0) {
                addActionToDOM({ dispositivo_id: devicesInRoom[0].id });
            } else {
                alert("Este cômodo não possui dispositivos para adicionar a uma nova cena.");
                renderRoomDetails(fromRoomId);
                return;
            }
        }

        showView('sceneEditor');
    }

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

    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-back-to-dashboard')) { renderDashboard(); }
    });

    btnToggleLogin.addEventListener('click', () => {
        usuarioLogado = !usuarioLogado;
        renderDashboard();
    });

    views.dashboard.addEventListener('click', async (e) => {
        const target = e.target.closest('button, .card-link, input.toggle-scene-active');
        if (!target) return;
        
        // Cômodos
        if (target.matches('#btn-show-add-comodo-modal')) { formComodo.reset(); document.getElementById('input-comodo-id').value = ''; document.getElementById('modal-comodo-title').textContent = 'Adicionar Novo Cômodo'; showModal(modalComodo); }
        else if (target.matches('.card-link')) { renderRoomDetails(parseInt(target.dataset.comodoId)); }
        else if (target.matches('.btn-edit-comodo')) { const comodo = await api.getComodoById(parseInt(target.dataset.comodoId)); document.getElementById('input-comodo-id').value = comodo.id; document.getElementById('input-comodo-name').value = comodo.nome; document.getElementById('modal-comodo-title').textContent = 'Editar Cômodo'; showModal(modalComodo); }
        else if (target.matches('.btn-delete-comodo')) { if (confirm("Certeza? Cenas associadas serão excluídas.")) { await api.deleteComodo(parseInt(target.dataset.comodoId)); renderDashboard(); } }
        
        // Cenas
        else if (target.matches('#btn-goto-scene-editor-new')) { renderSceneEditor(); }
        else if (target.matches('.btn-edit-cena')) { renderSceneEditor(parseInt(target.dataset.sceneId)); }
        else if (target.matches('.btn-delete-cena')) { if (confirm("Tem certeza que deseja excluir esta cena?")) { await api.deleteScene(parseInt(target.dataset.sceneId)); renderDashboard(); } }
        else if (target.matches('.btn-executar-cena')) { await api.executeScene(parseInt(target.dataset.sceneId)); alert('Cena executada!'); }
        else if (target.matches('.toggle-scene-active')) { await api.toggleSceneActiveState(parseInt(target.dataset.sceneId)); renderDashboard(); }
    });

    views.roomDetails.addEventListener('click', async (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        
        if (target.matches('#btn-create-scene-from-room')) { renderSceneEditor(null, currentRoomId); }
        else if (target.matches('#btn-show-add-device-modal')) { formDevice.reset(); document.getElementById('modal-device-title').textContent = 'Adicionar Novo Dispositivo'; showModal(modalDevice); }
        else if (target.matches('.btn-toggle-device')) { await api.toggleDispositivoState(parseInt(target.dataset.deviceId)); renderRoomDetails(currentRoomId); }
        else if (target.matches('.btn-delete-device')) { if (confirm("Certeza? Cenas que usam este dispositivo serão excluídas.")) { await api.deleteDispositivo(parseInt(target.dataset.deviceId)); renderRoomDetails(currentRoomId); } }
    });
    
    views.sceneEditor.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        if (target.matches('#btn-add-action')) { addActionToDOM(); }
        else if (target.matches('.btn-remove-action')) { target.closest('.action-card').remove(); }
    });

    formComodo.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('input-comodo-id').value;
        const nome = document.getElementById('input-comodo-name').value.trim();
        if (!nome) return alert("O nome do cômodo não pode ser vazio.");
        if (id) { await api.updateComodo(parseInt(id), nome); } else { await api.createComodo(nome); }
        hideModals();
        renderDashboard();
    });

    formDevice.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('input-device-name').value.trim();
        if (!nome) return alert("O nome do dispositivo não pode ser vazio.");
        await api.createDispositivo(nome, currentRoomId);
        hideModals();
        renderRoomDetails(currentRoomId);
    });
    
    formScene.addEventListener('submit', async (e) => {
        e.preventDefault();
        const sceneData = {
            id: document.getElementById('input-scene-id').value ? parseInt(document.getElementById('input-scene-id').value) : null,
            nome: document.getElementById('input-scene-name').value.trim(),
            acoes: Array.from(document.querySelectorAll('#scene-actions-list .action-card')).map((card, index) => ({
                ordem: index + 1,
                dispositivo_id: parseInt(card.querySelector('.action-device').value),
                acao_estado: card.querySelector('.action-state').value === 'true',
                intervalo_segundos: parseInt(card.querySelector('.action-interval').value)
            }))
        };
        if (!sceneData.nome) return alert("O nome da cena não pode ser vazio.");
        if (sceneData.acoes.length === 0) return alert("Uma cena precisa ter pelo menos uma ação.");
        await api.saveScene(sceneData);
        renderDashboard();
    });

    document.querySelectorAll('.btn-cancel-modal').forEach(btn => btn.addEventListener('click', hideModals));

    // --- INICIALIZAÇÃO ---
    renderDashboard();
});