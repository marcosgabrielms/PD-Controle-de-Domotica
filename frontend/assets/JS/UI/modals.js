
import { modalBackdrop } from './dom.js';

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