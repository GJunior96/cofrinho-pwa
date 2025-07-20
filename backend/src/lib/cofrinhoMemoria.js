import { mensagens } from './mensagens.js'
import { ErroDeValidacao } from './erros.js'

let saldo = 0,
    historico = []

export function resetarCofrinho() {
    saldo = 0
    historico = []
}

export function depositarNoCofrinho(valor, descricao = 'Depósito') {
    if (typeof valor !== 'number' || valor <= 0) {
        throw new ErroDeValidacao(mensagens.erro.valorInvalido)
    }

    saldo += valor
    historico.push({
        tipo: 'entrada',
        valor,
        descricao: descricao ?? 'Sem descrição',
        data: new Date().toISOString()
    })

  return saldo
}

export function gastarDoCofrinho(valor, descricao = 'Gasto registrado') {
  if (typeof valor !== 'number' || valor <= 0) {
    throw new ErroDeValidacao(mensagens.erro.valorInvalido)
  }

  saldo -= valor
  historico.push({
    tipo: 'saida',
    valor,
    descricao: descricao ?? 'Sem descrição',
    data: new Date().toISOString()
  })

  return saldo
}

export function consultarCofrinho() {
  return {
    saldo,
    historico
  }
}
