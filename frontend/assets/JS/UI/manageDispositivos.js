// assets/js/ui/manageDispositivos.js

import api from '../api/index.js';
import { showView } from './navigation.js';
import { dispositivosGridManage } from './dom.js';

/**
 * @module ManageDispositivosView
 * @description Renderiza a página de gerenciamento de todos os dispositivos.
 * @param {boolean} usuarioLogado 
 */
export async function renderManageDispositivos(usuarioLogado) {
    console.log("1. Iniciando renderManageDispositivos..."); 

    // 1. Busca todos os dados necessários da API
    const todosDispositivos = await api.getAllDispositivos();
    const todosComodos = await api.getComodos();

    console.log("2. Dispositivos recebidos da API:", todosDispositivos); 

    
    // Garante que o elemento da grid existe antes de continuar
    if (!dispositivosGridManage) {
        console.error("Elemento #dispositivos-grid-manage não foi encontrado no DOM.");
        return;
    }
    

    dispositivosGridManage.innerHTML = ''; // Limpa a grid antes de desenhar

    // 2. Cria os cards para cada dispositivo
    if (todosDispositivos.length === 0) {
        dispositivosGridManage.innerHTML = `<div class="empty-state-message">Nenhum dispositivo conectado ao sistema ainda.</div>`;
    } else {
        todosDispositivos.forEach(device => {
            const comodo = todosComodos.find(c => c.id === device.comodo_id);
            const nomeComodo = comodo ? comodo.nome : 'Não Alocado';
            
            const card = document.createElement('div');
            card.className = 'device-manage-card'; // Classe para o novo estilo de card
            
            card.innerHTML = `
                <div class="device-manage-card-header">
                    ${device.nome}
                </div>
                <div class="device-manage-card-body">
                    <div class="info-row">
                        <strong>Cômodo:</strong>
                        <span>${nomeComodo}</span>
                    </div>
                    <div class="info-row">
                        <strong>Status:</strong>
                        <span class="device-status ${device.estado ? 'on' : 'off'}">
                            ${device.estado ? 'Ligado' : 'Desligado'}
                        </span>
                    </div>
                </div>
                <div class="device-manage-card-actions">
                    <button class="btn-toggle-device" data-device-id="${device.id}" ${!usuarioLogado ? 'disabled' : ''}>
                        <i class="fas fa-power-off"></i>
                        <span>${device.estado ? 'Desligar' : 'Ligar'}</span>
                    </button>
                    <button class="btn-icon btn-delete-device" data-device-id="${device.id}" title="Excluir Dispositivo" ${!usuarioLogado ? 'disabled' : ''}>
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            dispositivosGridManage.appendChild(card);
            console.log(card);
        });
    }
    
    // 3. Mostra a view correta
    showView('manage-dispositivos');
}