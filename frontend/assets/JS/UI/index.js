// assets/js/ui/index.js

/**
 * @module UI
 * @description Ponto de entrada principal para o módulo de UI.
 * Exporta as funções de alto nível que o controller (app.js) usará para manipular a interface.
 */

export { showModal, hideModals, showConfirmationModal } from './modals.js';
export { renderDashboard } from './dashboard.js';
export { renderRoomDetails } from './roomDetails.js';
export { renderSceneEditor, addActionToDOM } from './sceneEditor.js';