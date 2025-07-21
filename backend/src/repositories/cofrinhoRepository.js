import { criarErro } from '../lib/erros.js'
import { mensagens } from '../lib/mensagens.js'

const cofrinhosPessoais = [],
      cofrinhosConjuntos = []

export function criarCofrinhoPessoal(usuarioId) {
    const jaExiste = cofrinhosPessoais.find(c => c.usuarioId == usuarioId)
    if (jaExiste) throw criarErro(mensagens.erro.usuarioJaPossuiCofrinho)

    const novoCofrinho = {
        id: gerar
    }
}