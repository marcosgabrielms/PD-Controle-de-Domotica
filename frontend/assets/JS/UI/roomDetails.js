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
        return renderDashboard(usuarioLogado); // Volta ao dashboard se o cômodo não existir
    }
    
    // Atualiza os títulos e botões da página
    document.getElementById('room-details-name').textContent = comodo.nome;
    document.getElementById('btn-show-add-device-modal').disabled = !usuarioLogado;
    document.getElementById('btn-create-scene-from-room').disabled = !usuarioLogado;

    const devices = await api.getDispositivosByComodoId(comodoId);
    const devicesGrid = document.getElementById('devices-grid');
    
    if (devices.length === 0) {
        devicesGrid.innerHTML = `<div class="empty-state-message">Nenhum dispositivo neste cômodo ainda.</div>`;
    } else {
        devicesGrid.innerHTML = devices.map(device => `
            <div class="device-card-details">
                <div class="device-card-header">
                    <span class="device-name">${device.nome}</span>
                    <button class="btn-icon btn-danger btn-delete-device" data-device-id="${device.id}" title="Excluir Dispositivo"><i class="fas fa-trash"></i></button>
                </div>
                <div class="device-card-body">
                    <span class="device-status ${device.estado ? 'on' : 'off'}">${device.estado ? 'Ligado' : 'Desligado'}</span>
                    <button class="btn-toggle-device" data-device-id="${device.id}">${device.estado ? 'Desligar' : 'Ligar'}</button>
                </div>
            </div>
        `).join('');
    }
    
    const allScenes = await api.getCenas();
    const deviceIdsInRoom = devices.map(d => d.id);
    const relatedScenes = allScenes.filter(scene => scene.acoes.some(acao => deviceIdsInRoom.includes(acao.dispositivo_id)));
    const relatedScenesList = document.getElementById('related-scenes-list');
    
    if (relatedScenes.length === 0) {
        relatedScenesList.innerHTML = `<div class="empty-state-message">Nenhuma cena controla dispositivos neste cômodo.</div>`;
    } else {
        relatedScenesList.innerHTML = relatedScenes.map(cena => `
            <div class="scene-item">
                <span class="scene-item-name">${cena.nome}</span>
                <span class="device-status ${cena.ativo ? 'on' : 'off'}">${cena.ativo ? 'Ativa' : 'Inativa'}</span>
            </div>
        `).join('');
    }
    
    showView('roomDetails');
}