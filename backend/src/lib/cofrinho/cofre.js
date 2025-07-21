export function criarCofrinho({ usuarioId }) {
    return {
        id: gerarId(),
        usuarioId,
        pessoal: {
            saldo: 0,
            historico: [],
            metas: []
        },
        conjuntos: []
    }
} 