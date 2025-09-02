// assets/js/ui/dashboard.js

import api from '../api/index.js';
import { showView } from './navigation.js';
import { comodosGrid,cenasList } from './dom.js';

/**
 * @module DashboardView
 * @description Funções para renderizar e atualizar a view do Dashboard.
 */

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
    const carouselContainer = document.getElementById('dispositivos-carousel');

    if (carouselContainer) {
        carouselContainer.innerHTML = ''; 

        if (todosDispositivos.length === 0) {
            carouselContainer.innerHTML = `<div class="empty-state-message">Nenhum dispositivo cadastrado.</div>`;
        } else {
            todosDispositivos.forEach(device => {
                const comodo = comodos.find(c => c.id === device.comodo_id);
                const nomeComodo = comodo ? comodo.nome : 'Não Alocado';
                const card = document.createElement('div');
                card.className = 'device-carousel-card';
                card.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${device.nome}</h5>
                        <div class="info-row">
                            <span>Cômodo:</span>
                            <strong>${nomeComodo}</strong>
                        </div>
                    </div>
                    <div class="card-actions">
                         <label class="switch" title="${device.estado ? 'Desligar' : 'Ligar'}">
                            <input type="checkbox" class="toggle-device-switch" data-device-id="${device.id}" ${device.estado ? 'checked' : ''} ${!usuarioLogado ? 'disabled' : ''}>
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
            // --- ALTERAÇÃO FINAL AQUI ---
            // As classes dos botões foram trocadas para .btn-primary
            card.innerHTML = `
                <div class="card-body">
                    <h4 class="card-title">${comodo.nome}</h4>
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
    if (cenas.length === 0) {
        cenasList.innerHTML = `<div class="empty-state-message">Nenhuma cena criada.</div>`;
    } else {
        cenasList.innerHTML = cenas.map(cena => `
            <div class="scene-item">
                <span class="scene-item-name">${cena.nome}</span>
                <div class="scene-item-actions">
                    <label class="switch" title="${cena.ativo ? 'Desativar' : 'Ativar'} cena">
                        <input type="checkbox" class="toggle-scene-active" data-scene-id="${cena.id}" ${cena.ativo ? 'checked' : ''} ${!usuarioLogado ? 'disabled' : ''}>
                        <span class="slider"></span>
                    </label>
                    <button class="btn-primary btn-executar-cena" data-scene-id="${cena.id}" ${!cena.ativo || !usuarioLogado ? 'disabled' : ''}><i class="fas fa-play"></i> Executar</button>
                    <button class="btn-icon btn-edit-cena" data-scene-id="${cena.id}" title="Editar Cena" aria-label="Editar Cena" ${!usuarioLogado ? 'disabled' : ''}><i class="fas fa-pencil-alt"></i></button>
                    <button class="btn-icon btn-danger btn-delete-cena" data-scene-id="${cena.id}" title="Excluir Cena" aria-label="Excluir Cena" ${!usuarioLogado ? 'disabled' : ''}><i class="fas fa-trash"></i></button>
                </div>
            </div>`).join('');
    }
        
    updateLoginUI(usuarioLogado);
    updateButtonStates(usuarioLogado, comodos.length > 0);
    showView('dashboard');
}