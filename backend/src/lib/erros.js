export class ErroDeValidacao extends Error {
    constructor({ mensagem, codigo = 400, tipo }) {
        super(mensagem)
        this.statusCode = 400
        this.tipo = tipo
    }
}

export function criarErro(objMensagem) {
    return new ErroDeValidacao(objMensagem)
}