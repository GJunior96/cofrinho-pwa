// src/modules/accounts/routes/account.routes.js
import { Router } from 'express';
import AccountController from '../controllers/AccountController.js';
import ensureAuthenticated from '../../../shared/middlewares/ensureAuthenticated.js'; // Middleware de autenticação
import transactionRoutes from '../../transactions/routes/TransactionRoutes.js'

const accountRoutes = Router();

// Todas as rotas de contas devem ser protegidas
accountRoutes.use(ensureAuthenticated); // Aplica o middleware a TODAS as rotas abaixo

// Rota para listar todas as contas do usuário logado
accountRoutes.get('/', AccountController.index);

// Rota para criar uma nova conta
accountRoutes.post('/', AccountController.create);

// Rota para buscar uma conta específica por ID
accountRoutes.get('/:id', AccountController.show);


accountRoutes.use('/:accountId/transactions', transactionRoutes)


export default accountRoutes;
