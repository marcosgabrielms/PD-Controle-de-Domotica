
import api from '../api/index.js';
import { showView } from './navigation.js';
import { renderRoomDetails } from './roomDetails.js';
import { formScene, sceneEditorTitle, sceneActionsList } from './dom.js';

/**
 * @module SceneEditorView
 * @description Funções para renderizar o editor de cenas.
 */

let allDevicesCache = [];

function addActionToDOM(action = {}) {
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
    sceneActionsList.appendChild(actionCard);
}

/**
 * @description Prepara e renderiza o formulário para criar ou editar uma cena.
 * @param {number | null} sceneId - O ID da cena a ser editada, ou null para criar uma nova.
 * @param {number | null} fromRoomId - (Opcional) ID do cômodo para pré-popular a primeira ação.
 */
export async function renderSceneEditor(sceneId = null, fromRoomId = null) {
    formScene.reset();
    document.getElementById('input-scene-id').value = '';
    sceneActionsList.innerHTML = '<h3>Sequência de Ações</h3>';
    
    allDevicesCache = await api.getAllDispositivos();
    if (allDevicesCache.length === 0) {
        alert("É preciso ter ao menos um dispositivo cadastrado para criar uma cena.");
        return;
    }

    if (sceneId) {
        const cena = await api.getCenaById(sceneId);
        sceneEditorTitle.textContent = `Editar Cena: ${cena.nome}`;
        document.getElementById('input-scene-id').value = cena.id;
        document.getElementById('input-scene-name').value = cena.nome;
        cena.acoes.sort((a,b) => a.ordem - b.ordem).forEach(acao => addActionToDOM(acao));
    } else {
        sceneEditorTitle.textContent = "Criar Nova Cena";
    }
    
    if (fromRoomId) {
        const devicesInRoom = allDevicesCache.filter(d => d.comodo_id === fromRoomId);
        if (devicesInRoom.length > 0) {
            addActionToDOM({ dispositivo_id: devicesInRoom[0].id });
        } else {
            alert("Este cômodo não possui dispositivos para adicionar a uma nova cena.");
            renderRoomDetails(fromRoomId); // NOTE: A função renderRoomDetails espera 2 argumentos
            return;
        }
    }
    showView('sceneEditor');
}