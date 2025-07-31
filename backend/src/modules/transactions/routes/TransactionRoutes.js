// src/modules/transactions/routes/transaction.routes.js
import { Router } from 'express';
import TransactionController from '../controllers/TransactionController.js';
import ensureAuthenticated from '../../../shared/middlewares/ensureAuthenticated.js';

const transactionRoutes = Router({mergeParams: true});

// Todas as rotas de transações devem ser protegidas
//transactionRoutes.use(ensureAuthenticated); // Aplica o middleware a TODAS as rotas abaixo

// Rota para criar uma nova transação (POST /accounts/:accountId/transactions)
// O accountId virá dos params da rota pai
transactionRoutes.post('/', TransactionController.create);

// Rota para listar transações de uma conta específica (GET /accounts/:accountId/transactions)
transactionRoutes.get('/', TransactionController.indexByAccount);

// Rota para buscar uma transação específica por ID (GET /accounts/:accountId/transactions/:transactionId)
transactionRoutes.get('/:transactionId', TransactionController.show);

export default transactionRoutes;
