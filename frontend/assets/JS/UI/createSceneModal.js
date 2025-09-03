// assets/js/ui/createSceneModal.js

import { showModal } from './modals.js';

/**
 * @description Prepara e exibe o modal de criação de cena, populando-o
 * com os dispositivos disponíveis no cômodo atual.
 * @param {Array<object>} devicesInRoom - A lista de dispositivos do cômodo.
 */
export function renderCreateSceneModal(devicesInRoom) {
    const form = document.getElementById('form-create-scene');
    form.reset(); // Limpa o formulário

    const deviceListContainer = document.getElementById('scene-devices-list-modal');
    deviceListContainer.innerHTML = ''; // Limpa a lista de dispositivos

    if (devicesInRoom.length === 0) {
        deviceListContainer.innerHTML = '<p>Não há dispositivos neste cômodo para adicionar a uma cena.</p>';
    } else {
        // Cria um checkbox para cada dispositivo
        devicesInRoom.forEach(device => {
            deviceListContainer.innerHTML += `
                <div class="checkbox-item">
                    <input type="checkbox" id="scene-device-${device.id}" value="${device.id}">
                    <label for="scene-device-${device.id}">${device.name}</label>
                </div>
            `;
        });
    }

    showModal(document.getElementById('modal-create-scene'));
}