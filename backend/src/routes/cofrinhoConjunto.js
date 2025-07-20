import express from 'express'
import { mensagens } from '../lib/mensagens.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
    depositarNoCofrinho,
    gastarDoCofrinho,
    consultarCofrinho,
    resetarCofrinho
} from '../lib/cofrinhoMemoria.js'
import { consultarHistoricoConjunto, consultarSaldoConjunto, depositarConjunto, gastarConjunto, resetarCofrinhoConjunto } from '../lib/cofrinho/conjunto.js'
import { consultarMetas, criarMeta, depositarMeta } from '../lib/cofrinho/metas.js'

const router = express.Router()

//#region cofrinho conjunto

// consultar saldo
router.get('/saldo', asyncHandler(async (req, res) => {
    res.json(consultarSaldoConjunto())
}))

// consultar historico
router.get('/historico', asyncHandler(async (req, res) => {
    res.json(consultarHistoricoConjunto())
}))

// depositar
router.post('/depositar', asyncHandler(async (req, res) => {
    depositarConjunto(req.body)
    res.status(200).json({ mensagem: mensagens.sucesso.deposito })
}))

// gastar
router.post('/gastar', asyncHandler(async (req, res) => {
    gastarConjunto(req.body)
    res.status(200).json({ mensagem: mensagens.sucesso.gasto })
}))

// resetar
router.post('/resetar', asyncHandler(async (req, res) => {
    resetarCofrinhoConjunto()
    res.status(200).json({ mensagem: mensagens.sucesso.resete })
}))

// criar meta
router.post('/metas', asyncHandler(async (req, res) => {
    const novaMeta = criarMeta(req.body)
    res.status(201).json(novaMeta)
}))

// depositar em uma meta
router.post('/metas/:id/depositar', asyncHandler(async (req, res) => {
    const metaAtualizada = depositarMeta({
        id: req.params.id,
        valor: req.body.valor
    })
    res.status(200).json(metaAtualizada)
}))

// listar metas
router.get('/metas', asyncHandler(async (req, res) => {
    const metas = consultarMetas()
    res.json({ metas })
}))

//#endregion
/*
// adicionar valor ao cofrinho
router.post(
    '/depositar',
    asyncHandler(async (req , res) => {
        const { valor, descricao } = req.body,
              saldoAtual = depositarNoCofrinho(valor, descricao)
        res.json({ saldoAtual, mensagem: mensagens.sucesso.deposito })
    })
)

// remover valor do cofrinho
router.post(
    '/gastar',
    asyncHandler(async (req, res) => {
        const { valor, descricao } = req.body,
              saldoAtual = gastarDoCofrinho(valor, descricao)
        res.json({ saldoAtual, mensagem: mensagens.sucesso.gasto })
    })
)

// resetar cofrinho
router.post(
    '/resetar',
    asyncHandler(async (req, res) => {
        resetarCofrinho()
        res.json({ saldoAtual, mensagem: mensagens.sucesso.resete })
    })
)


// consultar saldo atual
router.get('/saldo', (req, res) => {
    res.json(consultarCofrinho())
})
*/
export default router