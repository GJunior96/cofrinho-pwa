// src/modules/recurringExpenses/routes/recurringExpense.routes.js
import { Router } from 'express';
import RecurringExpenseController from '../controllers/RecurringExpenseController.js';
import ensureAuthenticated from '../../../shared/middlewares/ensureAuthenticated.js';
import validateRequest from '../../../shared/middlewares/validateRequest.js'; // Importa
import { createRecurringExpenseSchema, updateRecurringExpenseSchema, listRecurringExpensesSchema } from '../schemas/RecurringExpenseSchema.js'; // Importa os schemas

const recurringExpenseRoutes = Router();

recurringExpenseRoutes.use(ensureAuthenticated);

// Rota para listar todas as despesas recorrentes do usuário
recurringExpenseRoutes.get('/', validateRequest(listRecurringExpensesSchema, 'query'), RecurringExpenseController.index);

// Rota para criar uma nova despesa recorrente - com validação
recurringExpenseRoutes.post('/', validateRequest(createRecurringExpenseSchema), RecurringExpenseController.create);

// Rotas para operações em uma despesa recorrente específica (por ID)
recurringExpenseRoutes.get('/:id', RecurringExpenseController.show);
recurringExpenseRoutes.put('/:id', validateRequest(updateRecurringExpenseSchema), RecurringExpenseController.update); // Com validação
recurringExpenseRoutes.delete('/:id', RecurringExpenseController.delete);

export default recurringExpenseRoutes;
