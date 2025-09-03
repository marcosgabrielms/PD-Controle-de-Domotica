// assets/js/api/cenas.api.js

const API_URL = "http://127.0.0.1:8000";

export const cenasApi = {
    async getCenas() {
        const response = await fetch(`${API_URL}/scenes`);
        return await response.json();
    },

    async createSceneInRoom(roomId, sceneName, deviceIds, codeActive) {
    const response = await fetch(`${API_URL}/rooms/${roomId}/scenes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            scene_name: sceneName,
            device_ids: deviceIds,
            code_active: codeActive
        }) 
    });
        return await response.json();
    },

    async executeScene(id) {
        const response = await fetch(`${API_URL}/scenes/${id}/activate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code_active: String }) 
        });
        return await response.json();
    },
    
    async toggleSceneActiveState(sceneId, currentState) {
        const endpoint = currentState ? 'deactivate' : 'activate';
        const url = `${API_URL}/scenes/${sceneId}/${endpoint}`;

        // Prepara as opções do fetch
        const fetchOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };

        if (endpoint === 'activate') {
            fetchOptions.body = JSON.stringify({ code_active: String });
        }

        const response = await fetch(url, fetchOptions);
        
        if (!response.ok) {
            console.error(`Erro ao ${endpoint} a cena:`, await response.json());
            throw new Error('Falha na requisição');
        }

        return await response.json();
    },


    async createSceneInRoom(roomId, sceneName, deviceIds, codeActive) {
    const response = await fetch(`${API_URL}/rooms/${roomId}/scenes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            scene_name: sceneName,
            device_ids: deviceIds,
            code_active: codeActive
        })
    });
    return await response.json();
},
};