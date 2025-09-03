// assets/js/api/dispositivos.api.js

const API_URL = "http://127.0.0.1:8000";

export const dispositivosApi = {
    async getAllDispositivos() {
        const response = await fetch(`${API_URL}/devices`);
        return await response.json();
    },
    
    async createDispositivo(nome) {
    const response = await fetch(`${API_URL}/devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nome })
    });
        return await response.json();
    },


    async addDevicesToRoom(roomId, deviceIds) {
    const response = await fetch(`${API_URL}/rooms/${roomId}/devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_ids: deviceIds }) 
    });
        return await response.json();
    },

    async toggleDispositivoState(id) {
        const deviceResponse = await fetch(`${API_URL}/devices/${id}`);
        const device = await deviceResponse.json();
        
        const response = await fetch(`${API_URL}/devices/${id}/toggle`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ active: !device.active }) 
        });
        return await response.json();
    },
    
    async deleteDispositivo(id) {
        await fetch(`${API_URL}/devices/${id}`, { method: 'DELETE' });
        return { success: true };
    },
};