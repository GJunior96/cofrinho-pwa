import { mensagens } from "../../src/lib/mensagens"
import { describe, it, expect, beforeEach } from 'vitest'
import { consultarHistoricoConjunto, consultarSaldoConjunto, depositarConjunto, gastarConjunto, resetarCofrinhoConjunto } from "../../src/lib/cofrinho/conjunto"

describe('Função depositarConjunto', () => {
  beforeEach(() => {
    resetarCofrinhoConjunto()
  })

    describe.each([
        { valor: 100, valido: true, descricao: 'valor inteiro positivo' },
        { valor: 50.5, valido: true, descricao: 'valor decimal positivo' },
        { valor: 0, valido: false, descricao: 'zero' },
        { valor: -20, valido: false, descricao: 'negativo' },
        { valor: null, valido: false, descricao: 'nulo' },
        { valor: undefined, valido: false, descricao: 'undefined' }
    ])('Teste com $descricao', ({ valor, valido }) => {
        const usuario = 'teste'
        if (valido) {
        it(`deve aceitar valor ${valor}`, () => {
            depositarConjunto({ valor, usuario })
            expect(consultarSaldoConjunto()).toBe(valor)
        })
        } else {
        it(`deve lançar erro com valor ${valor}`, () => {
            expect(() => depositarConjunto({ valor, usuario }))
            .toThrow(mensagens.erro.valorInvalido.mensagem)
        })
        }
    })

    describe.each([
        { usuario: null, descricao: 'null' },
        { usuario: '', descricao: 'string vazia' },
        { usuario: '   ', descricao: 'apenas espaços' },
        { usuario: undefined, descricao: 'undefined' }
    ])('Campo usuario inválido: $descricao', ({ usuario }) => {
        it('deve lançar ErroDeValidacao', () => {
            expect(() =>
            depositarConjunto({ valor: 50, usuario })
            ).toThrow(mensagens.erro.usuarioObrigatorio.mensagem)
    })
    })
})

describe('Função gastarConjunto', () => {
    const saldoInicial = 100
    beforeEach(() => {
        resetarCofrinhoConjunto()
        depositarConjunto({ valor: saldoInicial, usuario: 'teste' })
    })

    describe.each([
        { valor: 100, valido: true, descricao: 'valor inteiro positivo' },
        { valor: 50.5, valido: true, descricao: 'valor decimal positivo' },
        { valor: 0, valido: false, descricao: 'zero' },
        { valor: -20, valido: false, descricao: 'negativo' },
        { valor: null, valido: false, descricao: 'nulo' },
        { valor: undefined, valido: false, descricao: 'undefined' }
    ])('Teste com $descricao', ({ valor, valido }) => {
        const usuario = 'teste'

        if (valido) {
        it(`deve aceitar valor ${valor}`, () => {
            gastarConjunto({ valor, usuario })
            expect(consultarSaldoConjunto()).toBe(saldoInicial - valor)
        })
        } else {
        it(`deve lançar erro com valor ${valor}`, () => {
            expect(() => gastarConjunto({ valor, usuario }))
            .toThrow(mensagens.erro.valorInvalido.mensagem)
        })
        }
    })

    describe.each([
        { usuario: null, descricao: 'null' },
        { usuario: '', descricao: 'string vazia' },
        { usuario: '   ', descricao: 'apenas espaços' },
        { usuario: undefined, descricao: 'undefined' }
    ])('Campo usuario inválido: $descricao', ({ usuario }) => {
        it('deve lançar ErroDeValidacao', () => {
            expect(() =>
            gastarConjunto({ valor: 50, usuario })
            ).toThrow(mensagens.erro.usuarioObrigatorio.mensagem)
    })
    })
})

describe('Função consultarHistoricoConjunto', () => {
    beforeEach(() => {
        resetarCofrinhoConjunto()
    })

    it('Deve registrar transações corretamente', () => {
        depositarConjunto({ valor: 100, descricao: 'historico com descricao', usuario: 'ususario deposito' })
        gastarConjunto({ valor: 50, usuario: 'usuario gasto' })

        const historicoAtual = consultarHistoricoConjunto()
        
        expect(consultarSaldoConjunto()).toBe(50)
        expect(Array.isArray(historicoAtual)).toBe(true)

        const entradas = historicoAtual.filter(p => p.tipo == 'entrada'),
              saidas = historicoAtual.filter(p => p.tipo == 'saida')
        
        expect(entradas.length).toBeGreaterThanOrEqual(1)
        expect(saidas.length).toBeGreaterThanOrEqual(1)

        historicoAtual.forEach(transacao => {
            expect(transacao).toHaveProperty('tipo')
            expect(transacao).toHaveProperty('valor')
            expect(transacao).toHaveProperty('descricao')
            expect(transacao).toHaveProperty('data')

            expect(['entrada', 'saida']).toContain(transacao.tipo)
            expect(typeof transacao.valor).toBe('number')
            expect(typeof transacao.descricao).toBe('string')
            expect(typeof transacao.data).toBe('string')
        })
    })
})

describe('Função resetarCofrinhoConjunto', () => {
    it('deve resetar o cofrinho', () => {
        depositarConjunto({ valor: 50, usuario: 'Teste' })
        depositarConjunto({ valor: 50, usuario: 'Teste' })
        gastarConjunto({ valor: 25.20, usuario: 'Teste' })
        gastarConjunto({ valor: 10.15, usuario: 'Teste' })
    
        resetarCofrinhoConjunto()
        const saldo = consultarSaldoConjunto(),
              historico = consultarHistoricoConjunto()
    
        expect(saldo).toBe(0)
        expect(historico.length).toBe(0)
    })
})
