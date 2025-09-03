// assets/js/ui/linkDeviceModal.js

import api from '../api/index.js';
import { showModal } from './modals.js';

// Busca os dispositivos não alocados e renderiza um modal para alocação
export async function renderAddDeviceToRoomModal(roomId) {
    const todosDispositivos = await api.getAllDispositivos();
    
    const unallocatedDevices = todosDispositivos.filter(d => !d.room_id);
    
    const container = document.getElementById('unallocated-devices-list');
    container.innerHTML = ''; // Limpa a lista

    if (unallocatedDevices.length === 0) {
        container.innerHTML = '<p>Nenhum dispositivo não alocado disponível para vincular.</p>';
    } else {
        unallocatedDevices.forEach(device => {
            // Cria um card para cada dispositivo órfão
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