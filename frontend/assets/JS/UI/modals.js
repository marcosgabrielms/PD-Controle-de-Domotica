
import { modalBackdrop } from './dom.js';


const confirmationModal = document.getElementById('modal-confirmation');
const confirmationMessage = document.getElementById('confirmation-message');
const btnConfirm = document.getElementById('btn-confirm-action');
const btnCancel = document.getElementById('btn-cancel-confirmation');

/**
 * Exibe um modal de confirmação e retorna uma promessa que resolve
 * para 'true' se o usuário confirmar, e 'false' se cancelar.
 * @param {string} message - A mensagem a ser exibida no modal.
 * @returns {Promise<boolean>}
 */
export function showConfirmationModal(message) {
    return new Promise((resolve) => {
        // Popula a mensagem
        document.getElementById('confirmation-message').textContent = message;

        // Mostra o backdrop e o modal de confirmação
        modalBackdrop.classList.remove('hidden');
        confirmationModal.classList.remove('hidden');

        // Seleciona os botões
        const btnConfirm = document.getElementById('btn-confirm-action');
        const btnCancel = document.getElementById('btn-cancel-confirmation');

        // Função para fechar e resolver a promessa
        const close = (value) => {
            modalBackdrop.classList.add('hidden');
            confirmationModal.classList.add('hidden');
            resolve(value);
        };
        
        // Adiciona os listeners de clique. Usamos 'once: true' para que o evento
        // seja removido automaticamente após o primeiro clique, evitando bugs.
        btnConfirm.addEventListener('click', () => close(true), { once: true });
        btnCancel.addEventListener('click', () => close(false), { once: true });
    });
}


/**
 * @module modals
 * @description Funções para controlar a exibição de modais.
 */

/**
 * @description Exibe um modal e o fundo escurecido.
 * @param {HTMLElement} modalElement - O elemento do modal a ser exibido.
 */
export function showModal(modalElement) {
    modalBackdrop.classList.remove('hidden');
    modalElement.classList.remove('hidden');
}

/**
 * @description Esconde todos os modais e o fundo escurecido.
 */
export function hideModals() {
    modalBackdrop.classList.add('hidden');
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
}