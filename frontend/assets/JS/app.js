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

let currentRoomId = null;
let usuarioLogado = false;

const formComodo = document.getElementById('form-comodo');
const formDevice = document.getElementById('form-device');
const formScene = document.getElementById('form-scene');
const menuToggle = document.getElementById('nav-menu-toggle');
const navMenuContainer = document.getElementById('nav-menu-container');

if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const hiddenItems = navMenuContainer.querySelectorAll('.nav-item-hidden, .nav-item-visible');
        hiddenItems.forEach(item => item.classList.toggle('nav-item-visible'));
    });
}

// --- MUDANÇA NO EVENT LISTENER ---
// Usamos um listener para 'change' e um para 'click' para cobrir tudo
document.body.addEventListener('change', async (e) => {
    const target = e.target;
    if (!target) return;

    // Novo handler para o toggle de dispositivo
    if (target.matches('.toggle-device-switch')) {
        await api.toggleDispositivoState(parseInt(target.dataset.deviceId));
        refreshCurrentView();
    }
});


document.body.addEventListener('click', async (e) => {
    const target = e.target.closest('button, a, .card-link, input.toggle-scene-active');
    if (!target) return;

    if (target.matches('#nav-dashboard-link')) {
        e.preventDefault();
        renderDashboard(usuarioLogado);
    }
    if (target.matches('#nav-about')) {
        e.preventDefault();
        const modalAbout = document.getElementById('modal-about');
        showModal(modalAbout);
    }

    if (target.matches('.btn-back-to-dashboard')) { renderDashboard(usuarioLogado); }
    if (target.matches('#btn-toggle-login')) { usuarioLogado = !usuarioLogado; refreshCurrentView(); }
    if (target.matches('.btn-cancel-modal')) { hideModals(); }

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
        refreshCurrentView();
    } else if (target.matches('.toggle-scene-active')) {
        await api.toggleSceneActiveState(parseInt(target.dataset.sceneId));
        renderDashboard(usuarioLogado);
    }

    if (target.matches('#btn-create-scene-from-room')) {
        renderSceneEditor(null, currentRoomId, usuarioLogado);
    } else if (target.matches('#btn-show-add-device-modal')) {
        formDevice.reset();
        document.getElementById('modal-device-title').textContent = 'Adicionar Novo Dispositivo';
        showModal(document.getElementById('modal-device'));
    } else if (target.matches('.btn-delete-device')) {
        const confirmed = await showConfirmationModal("Certeza? Cenas que usam este dispositivo serão afetadas.");
        if (confirmed) {
            await api.deleteDispositivo(parseInt(target.dataset.deviceId));
            refreshCurrentView();
        }
    }
});

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
            intervalo_segundos: parseInt(card.querySelector('.action-interval').value) || 0
        }))
    };
    if (!sceneData.nome) return alert("O nome da cena não pode ser vazio.");
    if (sceneData.acoes.length === 0) return alert("Uma cena precisa ter pelo menos uma ação.");
    await api.saveScene(sceneData);
    renderDashboard(usuarioLogado);
});

function refreshCurrentView() {
    const activeView = document.querySelector('.view:not(.hidden)');
    if (!activeView) {
        renderDashboard(usuarioLogado);
        return;
    }
    switch(activeView.id) {
        case 'view-dashboard':
            renderDashboard(usuarioLogado);
            break;
        case 'view-room-details':
            renderRoomDetails(currentRoomId, usuarioLogado);
            break;
        default:
            renderDashboard(usuarioLogado);
    }
}

renderDashboard(usuarioLogado);