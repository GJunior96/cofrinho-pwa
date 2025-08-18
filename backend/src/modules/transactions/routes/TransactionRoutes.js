// src/modules/transactions/routes/transaction.routes.js
import { Router } from 'express';
import TransactionController from '../controllers/TransactionController.js';
import ensureAuthenticated from '../../../shared/middlewares/ensureAuthenticated.js';
import validateRequest from '../../../shared/middlewares/validateRequest.js'; // Importa
import { createTransactionSchema, updateTransactionSchema, filterTransactionsSchema } from '../schemas/TransactionSchema.js'; // Importa os schemas

const transactionRoutes = Router({ mergeParams: true });

transactionRoutes.use(ensureAuthenticated);

// Rota para criar uma nova transação - com validação
transactionRoutes.post('/', validateRequest(createTransactionSchema), TransactionController.create);

// Rota para listar transações de uma conta específica
transactionRoutes.get('/', validateRequest (filterTransactionsSchema, 'query'), TransactionController.indexByAccount);

// Rota para buscar uma transação específica por ID
transactionRoutes.get('/:transactionId', TransactionController.show);

// Rota para atualizar uma transação - com validação
transactionRoutes.put('/:transactionId', validateRequest(updateTransactionSchema), TransactionController.update); // Adicione se tiver um update no controller
// Adicione um método update no TransactionController se não tiver!
/*
// Exemplo de update no TransactionController (se você não tiver ainda)

*/

export default transactionRoutes;
