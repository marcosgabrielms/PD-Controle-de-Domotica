// assets/js/api/comodos.api.js

import { data, nextId } from './store.js';

export const comodosApi = {
    /**
     * @description Busca todos os cômodos.
     * @returns {Array} Retorna um array com todos os objetos de cômodos
     */
    async getComodos() { return structuredClone(data.comodos); },

    /**
     * @description Busca um cômodo específico pelo seu ID.
     * @param {number} id O ID do cômodo a ser encontrado.
     * @returns {Object} Retorna um cômodo específico ou então nulo, caso não ache um cômodo
     */
    async getComodoById(id) { return data.comodos.find(c => c.id === id); },

    /**
     * @description Cria um novo cômodo.
     * @param {string} nome O nome para o novo cômodo.
     * @returns {Object} Retorna um cômodo recém-criado e atualiza o ID no banco simulado
     */
    async createComodo(nome) {
        const n = { id: nextId.comodo++, nome };
        data.comodos.push(n);
        return n;
    },
    
    /**
     * @description Atualiza o nome de um cômodo existente.
     * @param {number} id O ID do cômodo a ser atualizado.
     * @param {string} nome O novo nome para o cômodo.
     * @returns {Object} Um cômodo atualizado ou então nulo, em caso de erro na criação
     */
    async updateComodo(id, nome) {
        const c = data.comodos.find(c => c.id === id);
        if (c) c.nome = nome;
        return c;
    },

    /**
     * @description Exclui um cômodo e todas as cenas que dependem dos dispositivos contidos nele.
     * @param {number} id O ID do cômodo a ser excluído.
     * @returns Um parâmetro booleano indicando sucesso ou não
     */
    async deleteComodo(id) {
        const dispositivosNoComodo = data.dispositivos.filter(d => d.comodo_id === id);
        const dispositivoIds = dispositivosNoComodo.map(d => d.id);
        if (dispositivoIds.length > 0) {
            data.cenas = data.cenas.filter(cena =>
                !cena.acoes.some(acao => dispositivoIds.includes(acao.dispositivo_id))
            );
        }
        data.comodos = data.comodos.filter(c => c.id !== id);
        return { success: true };
    },
};