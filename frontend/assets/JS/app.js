// Módulo principal, que gerencia a aplicação e lida com eventos

import api from './api/index.js';
import {
    renderDashboard,
    renderRoomDetails,
    renderSceneEditor,
    showModal,
    showToast,
    hideModals,
    showConfirmationModal,
    renderCreateSceneModal,
    renderAddDeviceToRoomModal 

} from './ui/index.js';

let currentRoomId = null;
let usuarioLogado = false;

const formComodo = document.getElementById('form-comodo');
const formDevice = document.getElementById('form-device');
const formScene = document.getElementById('form-scene');
const formAddDeviceToRoom = document.getElementById('form-add-device-to-room');
const menuToggle = document.getElementById('nav-menu-toggle');
const navMenuContainer = document.getElementById('nav-menu-container');
const formCreateScene = document.getElementById('form-create-scene');


if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const hiddenItems = navMenuContainer.querySelectorAll('.nav-item-hidden, .nav-item-visible');
        hiddenItems.forEach(item => item.classList.toggle('nav-item-visible'));
    });
}

// usa um listener para 'change' e um para 'click' para cobrir tudo
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
    const inputTarget = e.target.closest('input.toggle-device-switch');
    const toggleInput = e.target.closest('input.toggle-scene-active');



    if (target.matches('#btn-create-scene-from-room')) {
        // Busca o cômodo atual para pegar a lista de dispositivos
        const comodo = await api.getComodoById(currentRoomId);
        if (comodo && comodo.devices) {
            renderCreateSceneModal(comodo.devices);
        }
    }
    
    if (toggleInput) {
        const sceneId = parseInt(toggleInput.dataset.sceneId);
        const currentState = toggleInput.dataset.currentState === 'true'; 
        
        await api.toggleSceneActiveState(sceneId, currentState);
        refreshCurrentView(); // Recarrega a tela para mostrar o novo estado
    }

    if (!target && !inputTarget) return; 

    // Lógica para clique no switch do carrosel
    if (inputTarget && inputTarget.matches('.toggle-device-switch')) {
        const deviceId = parseInt(inputTarget.dataset.deviceId);
        await api.toggleDispositivoState(deviceId);
        refreshCurrentView();
        return;
    }

    if (target.matches('.btn-toggle-device')) {
        const deviceId = parseInt(target.dataset.deviceId);
        await api.toggleDispositivoState(deviceId);
        refreshCurrentView();
        return;
    }

        if (target.matches('#btn-show-link-device-modal')) {
        // Chama a função da UI que vai buscar os dispositivos órfãos e montar o modal
            renderAddDeviceToRoomModal(currentRoomId); 
        }

    const formAddDeviceToRoom = document.getElementById('form-add-device-to-room');
    formAddDeviceToRoom.addEventListener('submit', async (e) => {
        e.preventDefault();
        const selectedIds = [];
        document.querySelectorAll('#unallocated-devices-list input:checked').forEach(input => {
            selectedIds.push(parseInt(input.value));
    });

        if (selectedIds.length > 0) {
            await api.addDevicesToRoom(currentRoomId, selectedIds);
            showToast('Dispositivos vinculados com sucesso!');
        }
        
        hideModals();
        // Recarrega a tela de detalhes do cômodo para mostrar os novos dispositivos
        renderRoomDetails(currentRoomId, usuarioLogado);
});

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
        document.getElementById('input-comodo-name').value = comodo.name;
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

formAddDeviceToRoom.addEventListener('submit', async (e) => {
    e.preventDefault();
    const selectedIds = [];
    document.querySelectorAll('#unallocated-devices-list input:checked').forEach(input => {
        selectedIds.push(parseInt(input.value));
    });

    if (selectedIds.length > 0) {
        await api.addDevicesToRoom(currentRoomId, selectedIds);
        showToast('Dispositivos vinculados com sucesso!');
    }
    
    hideModals();
    renderRoomDetails(currentRoomId, usuarioLogado);
});

// Formulário para criação de cena
formCreateScene.addEventListener('submit', async (e) => {
    e.preventDefault();

    const sceneName = document.getElementById('input-scene-name-modal').value.trim();
    const codeActive = document.getElementById('input-scene-code-modal').value.trim();
    const selectedDeviceIds = [];
    document.querySelectorAll('#scene-devices-list-modal input:checked').forEach(input => {
        selectedDeviceIds.push(parseInt(input.value));
    });

    if (!sceneName || !codeActive) {
        return alert('Por favor, preencha o nome da cena e o código de ativação.');
    }
    if (selectedDeviceIds.length === 0) {
        return alert('Por favor, selecione ao menos um dispositivo para a cena.');
    }

    await api.createSceneInRoom(currentRoomId, sceneName, selectedDeviceIds, codeActive);

    showToast('Cena criada com sucesso!');
    hideModals();

    renderRoomDetails(currentRoomId, usuarioLogado);
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