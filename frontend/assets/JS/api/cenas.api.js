// assets/js/api/cenas.api.js

import { data, nextId } from './store.js';

export const cenasApi = {
    /**
     * @description Busca todas as cenas.
     * @returns {Array} Uma promessa que resolve para um array com todos os objetos de cena.
     */
    async getCenas() { return structuredClone(data.cenas); },
    
    /**
     * @description Busca uma cena específica pelo seu ID.
     * @param {number} id O ID da cena a ser encontrada.
     * @returns {Object} O objeto da cena encontrada
     */
    async getCenaById(id) { return structuredClone(data.cenas.find(s => s.id === id)); },

    /**
     * @description Salva uma cena. Cria uma nova se não tiver ID, ou atualiza uma existente se tiver ID.
     * @param {object} sceneData O objeto da cena a ser salva.
     * @returns {boolean} Um parâmetro booleano indicando sucesso ou não
     */
    async saveScene(sceneData) {
        if (sceneData.id) {
            const index = data.cenas.findIndex(s => s.id === sceneData.id);
            if (index > -1) {
                const cenaExistente = data.cenas[index];
                data.cenas[index] = { ...cenaExistente, ...sceneData };
            }
        } else {
            const novaCena = { ...sceneData, id: nextId.cena++, ativo: true };
            data.cenas.push(novaCena);
        }
        return { success: true };
    },

    /**
     * @description Exclui uma cena pelo seu ID.
     * @param {number} id O ID da cena a ser excluída.
     * @returns {boolean} Um parâmetro booleano indicando sucesso ou não
     */
    async deleteScene(id) { data.cenas = data.cenas.filter(s => s.id !== id); return { success: true }; },

    /**
     * @description Executa as ações de uma cena, respeitando a ordem e os intervalos.
     * @param {number} id O ID da cena a ser executada.
     * @returns {boolean} Um parâmetro booleano indicando sucesso ou não
     */
    async executeScene(id) {
        const cena = data.cenas.find(s => s.id === id);
        if (!cena || !cena.ativo) return { success: false };
        console.log(`EXECUTANDO CENA: ${cena.nome}`);
        for (const acao of cena.acoes.sort((a, b) => a.ordem - b.ordem)) {
            const dispositivo = data.dispositivos.find(d => d.id === acao.dispositivo_id);
            if (dispositivo) {
                setTimeout(() => { dispositivo.estado = acao.acao_estado; }, acao.intervalo_segundos * 1000);
            }
        }
        return { success: true };
    },
    
    /**
     * @description Inverte o estado de ativação de uma cena (ativa/inativa).
     * @param {number} id O ID da cena a ser alterada.
     * @returns {Object} o objeto da cena com seu novo estado
     */
    async toggleSceneActiveState(id) {
        const c = data.cenas.find(s => s.id === id);
        if (c) { c.ativo = !c.ativo; }
        return c;
    }
};