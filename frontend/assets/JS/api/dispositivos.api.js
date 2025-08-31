// assets/js/api/dispositivos.api.js

import { data, nextId } from './store.js';

export const dispositivosApi = {
    /**
     * @description Busca todos os dispositivos cadastrados no sistema.
     * @returns Um array contendo todo os dispositivos 
     */
    async getAllDispositivos() { return structuredClone(data.dispositivos); },

    /**
     * @description Busca todos os dispositivos pertencentes a um cômodo específico.
     * @param {number} comodoId O ID do cômodo.
     * @returns {Array} Um array com os dispositivos do cômodo.
     */
    async getDispositivosByComodoId(comodoId) { return data.dispositivos.filter(d => d.comodo_id === comodoId); },

    /**
     * @description Cria um novo dispositivo e o associa a um cômodo.
     * @param {string} nome O nome do novo dispositivo.
     * @param {number} comodo_id O ID do cômodo ao qual o dispositivo pertencerá.
     * @returns {Promise<object>} Uma promessa que resolve para o objeto do dispositivo recém-criado.
     */
    async createDispositivo(nome, comodo_id) {
        const n = { id: nextId.dispositivo++, comodo_id, nome, estado: false };
        data.dispositivos.push(n);
        return n;
    },

    /**
     * @description Inverte o estado (liga/desliga) de um dispositivo.
     * @param {number} id O ID do dispositivo a ser alterado.
     * @returns {Promise<object|undefined>} Uma promessa que resolve para o objeto do dispositivo com seu novo estado.
     */
    async toggleDispositivoState(id) {
        const d = data.dispositivos.find(d => d.id === id);
        if (d) d.estado = !d.estado;
        return d;
    },

    /**
     * @description Exclui um dispositivo e todas as cenas que o utilizavam.
     * @param {number} id O ID do dispositivo a ser excluído.
     * @returns {Boolean} Um parâmetro booleano
     */
    async deleteDispositivo(id) {
        data.cenas = data.cenas.filter(cena => !cena.acoes.some(acao => acao.dispositivo_id === id));
        data.dispositivos = data.dispositivos.filter(d => d.id !== id);
        return { success: true };
    },
};