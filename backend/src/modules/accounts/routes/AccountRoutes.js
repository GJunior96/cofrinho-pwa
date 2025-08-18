// src/modules/accounts/routes/account.routes.js
import { Router } from 'express';
import AccountController from '../controllers/AccountController.js';
import ensureAuthenticated from '../../../shared/middlewares/ensureAuthenticated.js';
import validateRequest from '../../../shared/middlewares/validateRequest.js'; // Importa
import { createAccountSchema, updateAccountSchema } from '../schemas/AccountSchema.js'; // Importa os schemas
import transactionRoutes from '../../transactions/routes/TransactionRoutes.js';

const accountRoutes = Router();

accountRoutes.use(ensureAuthenticated);

// Rota para listar todas as contas do usuário logado
accountRoutes.get('/', AccountController.index);

// Rota para criar uma nova conta - com validação
accountRoutes.post('/', validateRequest(createAccountSchema), AccountController.create);

// Rota para buscar uma conta específica por ID
accountRoutes.get('/:id', AccountController.show);

// Rota para atualizar uma conta - com validação
accountRoutes.put('/:id', validateRequest(updateAccountSchema), AccountController.update); // Adicione se tiver um update no controller
// Adicione um método update no AccountController se não tiver!
/*
// Exemplo de update no AccountController (se você não tiver ainda)

*/


// ANINHANDO AS ROTAS DE TRANSAÇÃO DENTRO DA ROTA DE CONTA POR ID
accountRoutes.use('/:accountId/transactions', transactionRoutes);

export default accountRoutes;
