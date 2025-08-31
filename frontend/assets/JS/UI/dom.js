
/**
 * @module dom
 * @description Centraliza a seleção de todos os elementos do DOM necessários para a aplicação.
 */

// Views Principais
export const views = {
    dashboard: document.getElementById('view-dashboard'),
    roomDetails: document.getElementById('view-room-details'),
    sceneEditor: document.getElementById('view-scene-editor'),
};

// Modais
export const modalBackdrop = document.getElementById('modal-backdrop');
export const modalComodo = document.getElementById('modal-comodo');
export const modalDevice = document.getElementById('modal-device');

// Formulários
export const formComodo = document.getElementById('form-comodo');
export const formDevice = document.getElementById('form-device');
export const formScene = document.getElementById('form-scene');

// Elementos de conteúdo dinâmico
export const comodosGrid = document.getElementById('comodos-grid');
export const cenasList = document.getElementById('cenas-list');
export const devicesGrid = document.getElementById('devices-grid');
export const roomDetailsName = document.getElementById('room-details-name');
export const relatedScenesList = document.getElementById('related-scenes-list');
export const sceneEditorTitle = document.getElementById('scene-editor-title');
export const sceneActionsList = document.getElementById('scene-actions-list');
