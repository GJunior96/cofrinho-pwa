import { criarErro, ErroDeValidacao } from "../erros"
import { mensagens } from "../mensagens"

let saldoConjunto = 0,
    historicoConjunto = [],
    metasConjunto = [],
    gastosFixosConjunto = []

function registrarTransacaoConjunto({ tipo, valor, descricao, usuario }) {
    historicoConjunto.push({
        tipo,
        valor,
        descricao,
        usuario,
        data: new Date().toISOString()
    })
}

export function resetarCofrinhoConjunto() {
    saldoConjunto = 0
    historicoConjunto = []
}

export function consultarSaldoConjunto() {
    return saldoConjunto
}

export function consultarHistoricoConjunto() {
    return historicoConjunto
}

export function depositarConjunto({ valor, descricao = 'Sem descrição', usuario }) {
    if (!valor || valor <= 0) {
        throw criarErro(mensagens.erro.valorInvalido)
    }

    if (!usuario || typeof usuario !== 'string' || usuario.trim() == '') {
        throw criarErro(mensagens.erro.usuarioObrigatorio)
    }

    saldoConjunto += valor
    registrarTransacaoConjunto({ tipo: 'entrada', valor, descricao, usuario })
}

export function gastarConjunto({ valor, descricao = 'Sem descrição', usuario }) {
    if (!valor || valor <= 0) {
        throw criarErro(mensagens.erro.valorInvalido)
    }

    if (!usuario || typeof usuario !== 'string' || usuario.trim() == '') {
        throw criarErro(mensagens.erro.usuarioObrigatorio)
    }

    saldoConjunto -= valor
    registrarTransacaoConjunto({ tipo: 'saida', valor, descricao, usuario })
}

export function criarCofrinhoConjunto({ usuarios }) {
    if (!Array.isArray(usuarios) || usuarios.length < 2) {
        throw criarErro(mensagens.erro.usuariosConjuntoInvalidos)
    }

    const usuariosInvalidos = usuarios.some(
        u => typeof u !== 'string' || u.trim() === ''
    )

    if (usuariosInvalidos) {
    throw criarErro(mensagens.erro.usuarioInvalido)
    }

    const cofrinho = {
        id: gerarId(),
        tipo: 'conjunto',
        usuarios,
        saldo: 0,
        historico: [],
        metas: [],
        criadoEm: new Date().toISOString()
    }

    cofrinhoConjuntos.push(cofrinho)
    return cofrinho
}