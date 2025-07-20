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