// assets/js/api/comodos.api.js

const API_URL = "http://127.0.0.1:8000";

export const comodosApi = {
    async getComodos() {
        const response = await fetch(`${API_URL}/rooms/`, {
            redirect: 'follow'
        });
        return await response.json();
    },

    async getComodoById(id) {
        const response = await fetch(`${API_URL}/rooms/${id}`);
        return await response.json();
    },

    async createComodo(nome) {
        const response = await fetch(`${API_URL}/rooms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: nome })
        });
        return await response.json();
    },
    
    async updateComodo(id, nome) {
        const response = await fetch(`${API_URL}/rooms/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: nome })
        });
        return await response.json();
    },

    async deleteComodo(id) {
        const response = await fetch(`${API_URL}/rooms/${id}`, {
            method: 'DELETE'
        });
        return { success: true };
    },
};