import { describe, it, expect, beforeEach } from 'vitest'
import { mensagens } from '../../src/lib/mensagens.js'
import { iniciarCofrinho } from '../utils/setupCofrinho.js'
import { setupAppTests } from '../utils/setupAppTests.js'

/*const { app, request } = setupAppTests()

// testes de deposito
describe.each([
    { valor: 50, status: 200, saldoEsperado: 100 },
    { valor: 0, status: 400, erro: mensagens.erro.valorInvalido },
    { valor: -10, status: 400, erro: mensagens.erro.valorInvalido },
    { status: 400, erro: mensagens.erro.valorInvalido },
    { valor: 'vinte reais', status: 400, erro: mensagens.erro.valorInvalido },
    { valor: 15.75, status: 200, saldoEsperado: 65.75 },
    { valor: 0.10, status: 200, saldoEsperado: 50.10 }
]) ('Depósito com valor: $valor', ({ valor, status, saldoEsperado, erro }) => {
    beforeEach(() => {
        iniciarCofrinho(app)
    })

    it(`deve responder com status ${status}`, async () => {
        const res = await request(app)
            .post('/api/cofrinho/conjunto/depositar')
            .send({ valor })

        expect(res.statusCode).toBe(status)

        if(status == 200) {
            expect(res.body.saldoAtual).toBe(saldoEsperado)
            expect(typeof res.body.saldoAtual).toBe('number')
            expect(res.body.mensagem).toBe(mensagens.sucesso.deposito)
        } else {
            expect(res.body.erro).toBe(erro)
        }
    })
})

// testes de gasto
describe.each([
    { valor: 10, status: 200, saldoEsperado: 40 },
    { valor: 50, status: 200, saldoEsperado: 0 },
    { valor: 60, status: 200, saldoEsperado: -10 },
    { valor: 10.50, status: 200, saldoEsperado: 39.50 },
    { valor: 0, status: 400, erro: mensagens.erro.valorInvalido },
    { valor: -10, status: 400, erro: mensagens.erro.valorInvalido },
    { status: 400, erro: mensagens.erro.valorInvalido },
    { valor: 'dez reais', status: 400, erro: mensagens.erro.valorInvalido },
]) ('Gasto com valor: $valor', ({ valor, status, saldoEsperado, erro }) => {
    beforeEach(() => {
        iniciarCofrinho(app)
    })

    it(`deve responder com status ${status}`, async () => {
        const res = await request(app)
            .post('/api/cofrinho/conjunto/gastar')
            .send({ valor })

        expect(res.statusCode).toBe(status)

        if(status == 200) {
            expect(res.body.saldoAtual).toBe(saldoEsperado)
            expect(typeof res.body.saldoAtual).toBe('number')
            expect(res.body.mensagem).toBe(mensagens.sucesso.gasto)
        } else {
            expect(res.body.erro).toBe(erro)
        }
    })
})

  // testes de historico de transacao
  describe('Cofrinho - Histórico de transacões', () => {
    beforeEach(() => {
        iniciarCofrinho(app)
    })

    it('deve retornar entradas e saídas com tipo correto', async () => {
        // adiciona valor ao cofrinho
        await request(app)
            .post('/api/cofrinho/conjunto/depositar')
            .send({ valor: 25, descricao: 'Depósito extra' })

        // gasta parte do saldo
        await request(app)
            .post('/api/cofrinho/conjunto/gastar')
            .send({ valor: 10, descricao: 'Compra de refrigerante' })

        // consulta saldo e historico
        const res = await request(app).get('/api/cofrinho/conjunto/saldo')

        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('historico')
        expect(Array.isArray(res.body.historico)).toBe(true)

        const entradas = res.body.historico.filter(t => t.tipo == 'entrada'),
              saidas = res.body.historico.filter(t => t.tipo == 'saida')

        expect(entradas.length).toBeGreaterThanOrEqual(1)
        expect(saidas.length).toBeGreaterThanOrEqual(1)

        // verifica se os campos existem e têm tipos válidos
        res.body.historico.forEach(transacao => {
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

// teste de resete de cofrinho
describe('Cofrinho - Resete de saldo e histórico', () => {
    beforeEach(() => {
        iniciarCofrinho(app)
    })

    it('deve retornar o saldo e historico zerados', async () => {
        // adiciona mais valor
        await request(app)
            .post('/api/cofrinho/depositar')
            .send({ valor: 25, descricao: 'Depósito extra' })
    
        // gasta parte do saldo
        await request(app)
            .post('/api/cofrinho/gastar')
            .send({ valor: 10, descricao: 'Compra de refrigerante' })

        await request(app)
            .post('/api/cofrinho/resetar')

        const res = await request(app)
                    .get('/api/cofrinho/saldo')

        expect(res.statusCode).toBe(200)
        expect(res.body.historico).toEqual([])
        expect(Array.isArray(res.body.historico)).toBe(true)
        expect(res.body.saldo).toBe(0)
    })
})
    */