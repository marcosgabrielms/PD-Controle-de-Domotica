
/**
 * @description Objeto que simula dados para o sistema.
 * Contém métodos para realizar operações CRUD em cômodos, dispositivos e cenas.
 */

export const data = {
    comodos: [
        { id: 1, nome: "Sala de Estar" }, { id: 2, nome: "Quarto Principal" }, { id: 3, nome: "Cozinha" },
    ],
    dispositivos: [
        { id: 1, comodo_id: 1, nome: "Lâmpada Principal", estado: false },
        { id: 2, comodo_id: 1, nome: "Abajur", estado: true },
        { id: 3, comodo_id: 2, nome: "Ventilador de Teto", estado: false },
    ],
    cenas: [{
        id: 1, nome: "Boa Noite", ativo: true,
        acoes: [
            { dispositivo_id: 1, acao_estado: false, ordem: 1, intervalo_segundos: 0 },
            { dispositivo_id: 2, acao_estado: false, ordem: 2, intervalo_segundos: 1 },
            { dispositivo_id: 3, acao_estado: true, ordem: 3, intervalo_segundos: 2 },
        ]
    }, {
        id: 2, nome: "Noite de Cinema", ativo: true,
        acoes: [
            { dispositivo_id: 1, acao_estado: true, ordem: 1, intervalo_segundos: 0 },
            { dispositivo_id: 2, acao_estado: false, ordem: 2, intervalo_segundos: 1 },
        ]
    }]
};

export const nextId = { comodo: 4, dispositivo: 4, cena: 3 };