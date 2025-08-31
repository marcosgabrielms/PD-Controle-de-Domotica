
import { views } from './dom.js';

/**
 * @module navigation
 * @description Controla a visibilidade das "telas" (views) principais da aplicação.
 */

/**
 * @description Exibe uma view específica e esconde as outras.
 * @param {('dashboard'|'roomDetails'|'sceneEditor')} viewName - O nome da view a ser exibida.
 */
export function showView(viewName) {
    Object.values(views).forEach(view => view.classList.add('hidden'));
    if (views[viewName]) {
        views[viewName].classList.remove('hidden');
    }
}