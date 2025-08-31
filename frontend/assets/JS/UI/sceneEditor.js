import api from '../api/index.js';
import { showView } from './navigation.js';
import { renderRoomDetails } from './roomDetails.js';
import { formScene, sceneEditorTitle, sceneActionsList } from './dom.js';

/**
 * @module SceneEditorView
 * @description Funções para renderizar o editor de cenas.
 */

let allDevicesCache = [];

/**
 * @private
 * @description Adiciona um card de ação ao formulário do editor de cenas.
 * @param {object} action - (Opcional) Um objeto de ação pré-existente para popular os campos.
 */
export function addActionToDOM(action = {}) {
    const actionsList = document.getElementById('scene-actions-list');
    const actionCard = document.createElement('div');
    actionCard.className = 'action-card';
    
    // Cria as opções para o select de dispositivos
    const deviceOptions = allDevicesCache.map(d => 
        `<option value="${d.id}" ${action.dispositivo_id === d.id ? 'selected' : ''}>${d.nome}</option>`
    ).join('');

    actionCard.innerHTML = `
        <div class="action-card-header">
            <span>Passo</span>
            <button type="button" class="btn-icon btn-danger btn-remove-action" title="Remover Ação">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="action-card-body">
            <select class="action-device">${deviceOptions}</select>
            <select class="action-state">
                <option value="true" ${action.acao_estado === true ? 'selected' : ''}>Ligar</option>
                <option value="false" ${action.acao_estado === false || action.acao_estado === undefined ? 'selected' : ''}>Desligar</option>
            </select>
            <input type="number" class="action-interval" min="0" value="${action.intervalo_segundos || 0}" title="Atraso em segundos">
        </div>`;
    sceneActionsList.appendChild(actionCard);
}

/**
 * @description Prepara e renderiza o formulário para criar ou editar uma cena.
 * @param {number | null} sceneId - O ID da cena a ser editada, ou null para criar uma nova.
 * @param {number | null} fromRoomId - (Opcional) ID do cômodo para pré-popular a primeira ação.
 * @param {boolean} usuarioLogado - O estado de login do usuário.
 */
export async function renderSceneEditor(sceneId = null, fromRoomId = null, usuarioLogado) {
    // Busca os dispositivos primeiro para popular os selects
    allDevicesCache = await api.getAllDispositivos();
    if (allDevicesCache.length === 0 && !sceneId) {
        alert("É preciso ter ao menos um dispositivo cadastrado para criar uma cena.");
        return;
    }

    formScene.reset();
    document.getElementById('input-scene-id').value = '';
    
    
    sceneActionsList.innerHTML = `
        <div class="actions-list-header">
            <h3>Sequência de Ações</h3>
            <button type="button" id="btn-add-action"><i class="fas fa-plus"></i> Adicionar Passo</button>
        </div>`;

    if (sceneId) { // Editando uma cena existente
        const cena = await api.getCenaById(sceneId);
        sceneEditorTitle.textContent = `Editar Cena: ${cena.nome}`;
        document.getElementById('input-scene-id').value = cena.id;
        document.getElementById('input-scene-name').value = cena.nome;
        cena.acoes.sort((a, b) => a.ordem - b.ordem).forEach(acao => addActionToDOM(acao));
    } 
    
    else { // Criando uma cena nova
        sceneEditorTitle.textContent = "Criar Nova Cena";
        if (allDevicesCache.length > 0) {
            addActionToDOM(); 
        }
    }
    
    if (fromRoomId && !sceneId) {
        const devicesInRoom = allDevicesCache.filter(d => d.comodo_id === fromRoomId);
        if (devicesInRoom.length > 0) {
            // Remove o passo inicial em branco e adiciona o específico
            sceneActionsList.querySelector('.action-card').remove();
            addActionToDOM({ dispositivo_id: devicesInRoom[0].id });
        } else {
            alert("Este cômodo não possui dispositivos para adicionar a uma nova cena.");
            renderRoomDetails(fromRoomId, usuarioLogado);
            return;
        }
    }
    
    // Habilita/desabilita o botão de salvar com base no login
    document.getElementById('btn-save-scene').disabled = !usuarioLogado;

    showView('sceneEditor');
}