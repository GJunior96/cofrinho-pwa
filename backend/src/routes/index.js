import express from 'express'
import cofrinhoConjuntoRoutes from './cofrinhoConjunto.js'

const router = express.Router()

router.use('/cofrinho/conjunto', cofrinhoConjuntoRoutes)
router.use('/cofrinho/pessoal', pessoalRoutes)

export default router