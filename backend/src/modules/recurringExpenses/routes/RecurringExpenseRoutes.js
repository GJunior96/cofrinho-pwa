// src/modules/recurringExpenses/routes/recurringExpense.routes.js
import { Router } from 'express';
import RecurringExpenseController from '../controllers/RecurringExpenseController.js';
import ensureAuthenticated from '../../../shared/middlewares/ensureAuthenticated.js';

const recurringExpenseRoutes = Router();

// Todas as rotas de despesas recorrentes devem ser protegidas
recurringExpenseRoutes.use(ensureAuthenticated);

// Rota para listar todas as despesas recorrentes do usuário
recurringExpenseRoutes.get('/', RecurringExpenseController.index);

// Rota para criar uma nova despesa recorrente
recurringExpenseRoutes.post('/', RecurringExpenseController.create);

// Rotas para operações em uma despesa recorrente específica (por ID)
recurringExpenseRoutes.get('/:id', RecurringExpenseController.show);
recurringExpenseRoutes.put('/:id', RecurringExpenseController.update);
recurringExpenseRoutes.delete('/:id', RecurringExpenseController.delete);

export default recurringExpenseRoutes;
