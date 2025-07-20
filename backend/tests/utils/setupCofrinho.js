import request from 'supertest'
import { resetarCofrinho } from '../../src/lib/cofrinhoMemoria'

export async function iniciarCofrinho(app, valor = 50, descricao = 'Setup teste') {
    resetarCofrinho()
    await request(app)
        .post('/api/cofrinho/depositar')
        .send({ valor, descricao })
}