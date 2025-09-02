// assets/js/ui/dashboard.js

import api from '../api/index.js';
import { showView } from './navigation.js';
import { comodosGrid,cenasList } from './dom.js';

/**
 * @module DashboardView
 * @description Funções para renderizar e atualizar a view do Dashboard.
 */

/**
 * @private
 * @description Atualiza os elementos visuais que indicam o status de login.
 * @param {boolean} usuarioLogado - O estado de login do usuário.
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

/**
 * @private
 * @description Habilita ou desabilita botões com base no estado de login e na existência de cômodos.
 * @param {boolean} usuarioLogado - O estado de login.
 * @param {boolean} hasRooms - Se existem cômodos cadastrados.
 */
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

/**
 * @description Busca os dados e renderiza a tela principal do dashboard.
 * @param {boolean} usuarioLogado - O estado de login atual do usuário.
 */
export async function renderDashboard(usuarioLogado) {
    //  Busca os dados mais recentes da API
    const comodos = await api.getComodos();
    const cenas = await api.getCenas();

    const todosComodos = await api.getComodos();
    const todosDispositivos = await api.getAllDispositivos();

    const carouselContainer = document.getElementById('dispositivos-carousel');

    if (carouselContainer) {
        carouselContainer.innerHTML = ''; // Limpa o carrossel

        if (todosDispositivos.length === 0) {
            carouselContainer.innerHTML = `<div class="empty-state-message">Nenhum dispositivo cadastrado.</div>`;
        } else {
            todosDispositivos.forEach(device => {
                const comodo = todosComodos.find(c => c.id === device.comodo_id);
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
                        <div class="info-row">
                            <span>Status:</span>
                            <span class="device-status ${device.estado ? 'on' : 'off'}">
                                ${device.estado ? 'Ligado' : 'Desligado'}
                            </span>
                        </div>
                    </div>
                    <div class="card-actions">
                         <button class="btn-toggle-device" data-device-id="${device.id}" ${!usuarioLogado ? 'disabled' : ''}>
                            <i class="fas fa-power-off"></i>
                        </button>
                    </div>
                `;
                carouselContainer.appendChild(card);
            });
        }
    }

    // Limpa e renderiza os cards dos cômodos
    comodosGrid.innerHTML = '';
    comodos.forEach(comodo => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-body">
                <h4 class="card-title">${comodo.nome}</h4>
                <div class="card-link" data-comodo-id="${comodo.id}" title="Ver detalhes de ${comodo.nome}">
                    <span>Gerenciar Dispositivos</span>
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn-icon btn-edit-comodo" data-comodo-id="${comodo.id}" title="Editar nome" aria-label="Editar Cômodo"><i class="fas fa-pencil-alt"></i></button>
                <button class="btn-icon btn-danger btn-delete-comodo" data-comodo-id="${comodo.id}" title="Excluir cômodo" aria-label="Excluir Cômodo"><i class="fas fa-trash"></i></button>
            </div>`;
        comodosGrid.appendChild(card);
    });

    

    // Limpa e renderiza a lista de cenas
    cenasList.innerHTML = cenas.map(cena => `
        <div class="scene-item">
            <span class="scene-item-name">${cena.nome}</span>
            <div class="scene-item-actions">
                <label class="switch" title="${cena.ativo ? 'Desativar' : 'Ativar'} cena">
                    <input type="checkbox" class="toggle-scene-active" data-scene-id="${cena.id}" ${cena.ativo ? 'checked' : ''} ${!usuarioLogado ? 'disabled' : ''}>
                    <span class="slider"></span>
                </label>
                <button class="btn-executar-cena" data-scene-id="${cena.id}" ${!cena.ativo ? 'disabled' : ''}><i class="fas fa-play"></i> Executar</button>
                <button class="btn-icon btn-edit-cena" data-scene-id="${cena.id}" title="Editar Cena" aria-label="Editar Cena"><i class="fas fa-pencil-alt"></i></button>
                <button class="btn-icon btn-danger btn-delete-cena" data-scene-id="${cena.id}" title="Excluir Cena" aria-label="Excluir Cena"><i class="fas fa-trash"></i></button>
            </div>
        </div>`).join('');


        
    
    // Atualiza os estados visuais da página (login, botões, etc)
    updateLoginUI(usuarioLogado);
    updateButtonStates(usuarioLogado, comodos.length > 0);
    
    // Garante que a view do dashboard seja a que está visível
    showView('dashboard');
}