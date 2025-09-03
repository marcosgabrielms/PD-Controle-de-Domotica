// assets/js/ui/dashboard.js

import api from '../api/index.js';
import { showView } from './navigation.js';
import { comodosGrid,cenasList } from './dom.js';

/**
 * @module DashboardView
 * @description Funções para renderizar e atualizar a view do Dashboard.
 */

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
    // Ícone padrão
    return 'assets/imagens/lampada.png';
}

function updateLoginUI(usuarioLogado) {
    const loginStatusIcon = document.getElementById('login-status-icon');
    const loginStatusText = document.getElementById('login-status-text');
    if (usuarioLogado) {
        loginStatusIcon.className = 'status-icon logged-in';
        loginStatusIcon.title = "Você está logado.";
        loginStatusText.textContent = "Logado";
    } else {
        loginStatusIcon.className = 'status-icon logged-out';
        loginStatusIcon.title = "Você está deslogado.";
        loginStatusText.textContent = "Deslogado";
    }
}

function updateButtonStates(usuarioLogado, hasRooms) {
    document.getElementById('btn-show-add-comodo-modal').disabled = !usuarioLogado;
    const btnCreateCena = document.getElementById('btn-goto-scene-editor-new');
    if (usuarioLogado && hasRooms) {
        btnCreateCena.disabled = false;
        btnCreateCena.title = "Criar uma nova cena";
    } else {
        btnCreateCena.disabled = true;
        btnCreateCena.title = !usuarioLogado ? "Faça o login para criar uma cena." : "Adicione um cômodo antes de criar uma cena.";
    }
}

export async function renderDashboard(usuarioLogado) {
    const comodos = await api.getComodos();
    const cenas = await api.getCenas();
    const todosDispositivos = await api.getAllDispositivos();
    
    const comodosGrid = document.getElementById('comodos-grid');
    const carouselContainer = document.getElementById('dispositivos-carousel');
    const cenasList = document.getElementById('cenas-list');

    if (carouselContainer) {
        carouselContainer.innerHTML = ''; 

        if (todosDispositivos.length === 0) {
            carouselContainer.innerHTML = `<div class="empty-state-message">Nenhum dispositivo cadastrado.</div>`;
        } else {
            todosDispositivos.forEach(device => {
                
                const card = document.createElement('div');
                card.className = 'device-carousel-card';
                
                card.innerHTML = `
                    <div class="card-body">
                        <div class="device-icon-container ${device.active ? 'on' : 'off'}">
                            <img src="${getDeviceIcon(device.name)}" alt="${device.name}">
                        </div>
                        <h5 class="card-title">${device.name}</h5>
                        </div>
                    <div class="card-actions">
                         <label class="switch" title="${device.active ? 'Desligar' : 'Ligar'}">
                            <input type="checkbox" class="toggle-device-switch" data-device-id="${device.id}" ${device.active ? 'checked' : ''} ${!usuarioLogado ? 'disabled' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                `;
                carouselContainer.appendChild(card);
            });
        }
    }

    comodosGrid.innerHTML = '';
    if (comodos.length === 0 && cenas.length > 0) { 
        comodosGrid.innerHTML = `<div class="empty-state-message">Crie um cômodo para poder gerenciar seus dispositivos.</div>`;
    } else {
        comodos.forEach(comodo => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-body">
                    <h4 class="card-title">${comodo.name}</h4>
                    <div class="card-link" data-comodo-id="${comodo.id}" title="Ver detalhes de ${comodo.nome}">
                        <span>Gerenciar Dispositivos</span>
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn-primary btn-edit-comodo" data-comodo-id="${comodo.id}" title="Editar nome" aria-label="Editar Cômodo" ${!usuarioLogado ? 'disabled' : ''}><i class="fas fa-pencil-alt"></i> Editar Nome</button>
                    <button class="btn-primary btn-delete-comodo" data-comodo-id="${comodo.id}" title="Excluir cômodo" aria-label="Excluir Cômodo" ${!usuarioLogado ? 'disabled' : ''}><i class="fas fa-trash"></i> Excluir Cômodo</button>
                </div>`;
            comodosGrid.appendChild(card);
        });
    }

    cenasList.innerHTML = '';
    if (cenasList) {
        if (cenas.length === 0) {
            cenasList.innerHTML = `<div class="empty-state-message">Nenhuma cena criada.</div>`;
        } else {
            cenasList.innerHTML = cenas.map(cena => `
                <div class="scene-item">
                    <span class="scene-item-name">${cena.name}</span>
                    <div class="scene-item-actions">
                        <label class="switch" title="${cena.active ? 'Desativar' : 'Ativar'} cena">
                            <input type="checkbox" class="toggle-scene-active" data-scene-id="${cena.id}" data-current-state="${cena.active}" ${cena.active ? 'checked' : ''} ${!usuarioLogado ? 'disabled' : ''}>
                            <span class="slider"></span>
                        </label>
                        <button class="btn-primary btn-executar-cena" data-scene-id="${cena.id}" ${!cena.active || !usuarioLogado ? 'disabled' : ''}><i class="fas fa-play"></i> Executar</button>
                        <button class="btn-icon btn-edit-cena" data-scene-id="${cena.id}" title="Editar Cena" aria-label="Editar Cena" ${!usuarioLogado ? 'disabled' : ''}><i class="fas fa-pencil-alt"></i></button>
                        <button class="btn-icon btn-danger btn-delete-cena" data-scene-id="${cena.id}" title="Excluir Cena" aria-label="Excluir Cena" ${!usuarioLogado ? 'disabled' : ''}><i class="fas fa-trash"></i></button>
                    </div>
                </div>`).join('');
        }
    }
        
    updateLoginUI(usuarioLogado);
    updateButtonStates(usuarioLogado, comodos.length > 0);
    showView('dashboard');
}