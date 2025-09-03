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
    
    document.getElementById('room-details-name').textContent = comodo.name;
    document.getElementById('btn-show-link-device-modal').disabled = !usuarioLogado;
    document.getElementById('btn-create-scene-from-room').disabled = !usuarioLogado;

    const devices = comodo.devices || []; 
    const devicesGrid = document.getElementById('devices-grid');
    
    if (devices.length === 0) {
        devicesGrid.innerHTML = `<div class="empty-state-message">Nenhum dispositivo neste cômodo ainda.</div>`;
    } else {
        devicesGrid.innerHTML = devices.map(device => `
            <div class="device-card-details">
                <div class="device-card-header">
                    <span class="device-name">${device.name}</span>
                    <button class="btn-icon btn-danger btn-delete-device" data-device-id="${device.id}" title="Excluir Dispositivo" ${!usuarioLogado ? 'disabled' : ''}>
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="device-card-body">
                    <div class="device-icon-container ${device.estado ? 'on' : 'off'}">
                        <img src="${getDeviceIcon(device.name)}" alt="${device.name}">
                    </div>
                    <span class="device-status ${device.active ? 'on' : 'off'}">${device.active ? 'Ligado' : 'Desligado'}</span>
                    <label class="switch" title="${device.active ? 'Desligar' : 'Ligar'}">
                        <input type="checkbox" class="toggle-device-switch" data-device-id="${device.id}" ${device.active ? 'checked' : ''} ${!usuarioLogado ? 'disabled' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
        `).join('');
    }
    
    const allScenes = await api.getCenas();
    const deviceIdsInRoom = (comodo.devices || []).map(d => d.id);
    const relatedScenes = allScenes.filter(scene => 
        scene.acoes && Array.isArray(scene.acoes) && scene.acoes.some(acao => deviceIdsInRoom.includes(acao.dispositivo_id))
    );    
    
    const relatedScenesList = document.getElementById('related-scenes-list');
    
    if (relatedScenes.length === 0) {
        relatedScenesList.innerHTML = `<div class="empty-state-message">Nenhuma cena controla dispositivos neste cômodo.</div>`;
    } else {
        relatedScenesList.innerHTML = relatedScenes.map(cena => `
            <div class="scene-item">
                <span class="scene-item-name">${cena.name}</span>
                <span class="device-status ${cena.active ? 'on' : 'off'}">${cena.active ? 'Ativa' : 'Inativa'}</span>
            </div>
        `).join('');
    }
    
    showView('roomDetails');
}

export async function renderAddDeviceToRoomModal(roomId) {
    const todosDispositivos = await api.getAllDispositivos();
    // Filtra apenas os dispositivos que não têm cômodo (room_id é null ou undefined)
    const unallocatedDevices = todosDispositivos.filter(d => !d.room_id);
    
    const container = document.getElementById('unallocated-devices-list');
    container.innerHTML = ''; 

    if (unallocatedDevices.length === 0) {
        container.innerHTML = '<p>Nenhum dispositivo não alocado disponível para vincular.</p>';
    } else {
        unallocatedDevices.forEach(device => {
            container.innerHTML += `
                <div class="checkbox-item">
                    <input type="checkbox" id="device-link-${device.id}" value="${device.id}">
                    <label for="device-link-${device.id}">${device.name}</label>
                </div>
            `;
        });
    }
    showModal(document.getElementById('modal-add-device-to-room'));
}