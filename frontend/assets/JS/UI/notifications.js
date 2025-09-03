// assets/js/ui/notifications.js

/**
 * @module notifications
 * @description Módulo para exibir notificações (toasts) na tela.
 */

const toastElement = document.getElementById('toast-notification');
const toastMessage = document.getElementById('toast-message');
const toastIcon = document.getElementById('toast-icon');


 
export function showToast(message, type = 'success') {
    toastMessage.textContent = message;

    if (type === 'success') {
        toastElement.className = 'toast success';
        toastIcon.className = 'fas fa-check-circle';
    } else {
        toastElement.className = 'toast error';
        toastIcon.className = 'fas fa-times-circle';
    }

    toastElement.classList.add('show');

    setTimeout(() => {
        toastElement.classList.remove('show');
    }, 3000); 
}