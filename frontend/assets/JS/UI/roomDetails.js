// assets/js/ui/roomDetails.js

import api from '../api/index.js';
import { showView } from './navigation.js';
import { renderDashboard } from './dashboard.js';
import { devicesGrid, roomDetailsName, relatedScenesList } from './dom.js';

/**
 * @module RoomDetailsView
 * @description Função para renderizar a tela de detalhes de um cômodo.
 */

/**
 * @description Busca os dados de um cômodo e seus dispositivos e renderiza a tela.
 * @param {number} comodoId - O ID do cômodo a ser exibido.
 * @param {boolean} usuarioLogado - O estado de login do usuário.
 */
export async function renderRoomDetails(comodoId, usuarioLogado) {
    const comodo = await api.getComodoById(comodoId);
    if (!comodo) {
        return renderDashboard(usuarioLogado);
    }
    
    roomDetailsName.textContent = comodo.nome;
    document.getElementById('btn-show-add-device-modal').disabled = !usuarioLogado;
    document.getElementById('btn-create-scene-from-room').disabled = !usuarioLogado;

    const devices = await api.getDispositivosByComodoId(comodoId);
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
    relatedScenesList.innerHTML = relatedScenes.length === 0 ? '<p>Nenhuma cena controla dispositivos neste cômodo.</p>' :
        relatedScenes.map(cena => `
        <div class="scene-item">
            <span class="scene-item-name">${cena.nome}</span>
            <span>${cena.ativo ? 'Ativa' : 'Inativa'}</span>
        </div>`).join('');
    
    showView('roomDetails');
}