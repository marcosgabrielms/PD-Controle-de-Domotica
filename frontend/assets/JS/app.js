// Módulo principal, que gerencia a aplicação e lida com eventos

import api from './api/index.js';
import {
    renderDashboard,
    renderRoomDetails,
    renderSceneEditor,
    showModal,
    hideModals,
    showConfirmationModal
} from './ui/index.js';

//  ESTADO GLOBAL DO APP 
let currentRoomId = null;
let usuarioLogado = false;

//  ELEMENTOS DO DOM 
const formComodo = document.getElementById('form-comodo');
const formDevice = document.getElementById('form-device');
const formScene = document.getElementById('form-scene');
const sidebarToggle = document.getElementById('sidebar-toggle');
const appContainer = document.querySelector('.app-container');

//  MANIPULADORES DE EVENTOS 

// Lógica para abrir/fechar a sidebar
if (sidebarToggle && appContainer) {
    sidebarToggle.addEventListener('click', () => {
        appContainer.classList.toggle('sidebar-open');
    });
}

/**
 * Handler de eventos centralizado para todas as ações de clique na página.
 * Usa a técnica de "Delegação de Eventos".
 */
document.body.addEventListener('click', async (e) => {
    const target = e.target.closest('button, .card-link, input.toggle-scene-active');
    if (!target) return;

    // Botão de ligar dos cartões de dispositivos na home 

    if(target.matches('.btn-toggle-devices')) {
        const deviceId = parseInt(target.dataset.deviceId);

        await api.toggleDispositivoState(deviceId);

        // 3. ATUALIZA A TELA ATUAL para refletir a mudança
        refreshCurrentView(); 
    }
    //  Ações Globais 
    if (target.matches('.btn-back-to-dashboard')) { renderDashboard(usuarioLogado); }
    if (target.matches('#btn-toggle-login')) { usuarioLogado = !usuarioLogado; renderDashboard(usuarioLogado); }
    if (target.matches('.btn-cancel-modal')) { hideModals(); }

    //  Ações do Dashboard 
    if (target.matches('#btn-show-add-comodo-modal')) {
        formComodo.reset();
        document.getElementById('input-comodo-id').value = '';
        document.getElementById('modal-comodo-title').textContent = 'Adicionar Novo Cômodo';
        showModal(document.getElementById('modal-comodo'));
    } else if (target.matches('.card-link')) {
        currentRoomId = parseInt(target.dataset.comodoId);
        renderRoomDetails(currentRoomId, usuarioLogado);
    } else if (target.matches('.btn-edit-comodo')) {
        const comodo = await api.getComodoById(parseInt(target.dataset.comodoId));
        document.getElementById('input-comodo-id').value = comodo.id;
        document.getElementById('input-comodo-name').value = comodo.nome;
        document.getElementById('modal-comodo-title').textContent = 'Editar Cômodo';
        showModal(document.getElementById('modal-comodo'));
    } else if (target.matches('.btn-delete-comodo')) {

        const confirmed = await showConfirmationModal("Certeza? Cenas associadas serão excluídas.");
        if (confirmed) {
            await api.deleteComodo(parseInt(target.dataset.comodoId));
            renderDashboard(usuarioLogado);
        }
    } else if (target.matches('#btn-goto-scene-editor-new')) {
        renderSceneEditor(null, null, usuarioLogado);
    } else if (target.matches('.btn-edit-cena')) {
        renderSceneEditor(parseInt(target.dataset.sceneId), null, usuarioLogado);
    } else if (target.matches('.btn-delete-cena')) {

        const confirmed = await showConfirmationModal("Tem certeza que deseja excluir esta cena?");
        if (confirmed) {
            await api.deleteScene(parseInt(target.dataset.sceneId));
            renderDashboard(usuarioLogado);
        }
    } else if (target.matches('.btn-executar-cena')) {
        await api.executeScene(parseInt(target.dataset.sceneId));
        alert('Cena executada!');
    } else if (target.matches('.toggle-scene-active')) {
        await api.toggleSceneActiveState(parseInt(target.dataset.sceneId));
        renderDashboard(usuarioLogado);
    }

    //  Ações da Tela de Detalhes do Cômodo 
    if (target.matches('#btn-create-scene-from-room')) {
        renderSceneEditor(null, currentRoomId, usuarioLogado);
    } else if (target.matches('#btn-show-add-device-modal')) {
        formDevice.reset();
        document.getElementById('modal-device-title').textContent = 'Adicionar Novo Dispositivo';
        showModal(document.getElementById('modal-device'));
    } else if (target.matches('.btn-toggle-device')) {
        await api.toggleDispositivoState(parseInt(target.dataset.deviceId));
        renderRoomDetails(currentRoomId, usuarioLogado);
    } else if (target.matches('.btn-delete-device')) {

        const confirmed = await showConfirmationModal("Certeza? Cenas que usam este dispositivo serão excluídas.");
        if (confirmed) {
            await api.deleteDispositivo(parseInt(target.dataset.deviceId));
            renderRoomDetails(currentRoomId, usuarioLogado);
        }
    }
});

//  EVENTOS DE SUBMISSÃO DE FORMULÁRIOS 
formComodo.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('input-comodo-id').value;
    const nome = document.getElementById('input-comodo-name').value.trim();
    if (!nome) return alert("O nome do cômodo não pode ser vazio.");
    if (id) { await api.updateComodo(parseInt(id), nome); } else { await api.createComodo(nome); }
    hideModals();
    renderDashboard(usuarioLogado);
});

formDevice.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('input-device-name').value.trim();
    if (!nome) return alert("O nome do dispositivo não pode ser vazio.");
    await api.createDispositivo(nome, currentRoomId);
    hideModals();
    renderRoomDetails(currentRoomId, usuarioLogado);
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
    renderDashboard(usuarioLogado);
});

// --- INICIALIZAÇÃO ---
renderDashboard(usuarioLogado);