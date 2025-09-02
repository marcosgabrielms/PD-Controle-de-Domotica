// assets/js/ui/roomDetails.js

import api from '../api/index.js';
import { showView } from './navigation.js';
import { renderDashboard } from './dashboard.js';

// Função auxiliar para escolher o ícone do dispositivo
function getDeviceIcon(deviceName) {
    const name = deviceName.toLowerCase();
    if (name.includes('lâmpada') || name.includes('abajur')) {
        return 'assets/imagens/lampada.png';
    }
    if (name.includes('ventilador de teto')) {
        return 'assets/imagens/ventilador-de-teto.png';
    }
    if (name.includes('ventilador')) {
        return 'assets/imagens/ventilador.png';
    }
    return 'assets/imagens/lampada.png';
}

export async function renderRoomDetails(comodoId, usuarioLogado) {
    const comodo = await api.getComodoById(comodoId);
    if (!comodo) {
        return renderDashboard(usuarioLogado);
    }
    
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
                    <button class="btn-icon btn-danger btn-delete-device" data-device-id="${device.id}" title="Excluir Dispositivo" ${!usuarioLogado ? 'disabled' : ''}>
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="device-card-body">
                    <div class="device-icon-container ${device.estado ? 'on' : 'off'}">
                        <img src="${getDeviceIcon(device.nome)}" alt="${device.nome}">
                    </div>
                    <span class="device-status ${device.estado ? 'on' : 'off'}">${device.estado ? 'Ligado' : 'Desligado'}</span>
                    <label class="switch" title="${device.estado ? 'Desligar' : 'Ligar'}">
                        <input type="checkbox" class="toggle-device-switch" data-device-id="${device.id}" ${device.estado ? 'checked' : ''} ${!usuarioLogado ? 'disabled' : ''}>
                        <span class="slider"></span>
                    </label>
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