// assets/js/api/index.js

import { comodosApi } from './comodos.api.js';
import { dispositivosApi } from './dispositivos.api.js';
import { cenasApi } from './cenas.api.js';

/**
 * @description Objeto principal da API que agrega todos os módulos de entidade.
 * Ele funciona pegando todas as funções dos arquivos e agregando dentro de um objeto, desempacotando os arquivos.
 */
const api = {
    ...comodosApi,
    ...dispositivosApi,
    ...cenasApi,
};

export default api;