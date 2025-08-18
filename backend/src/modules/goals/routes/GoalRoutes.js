// src/modules/goals/routes/goal.routes.js
import { Router } from 'express';
import GoalController from '../controllers/GoalController.js';
import ensureAuthenticated from '../../../shared/middlewares/ensureAuthenticated.js';
import validateRequest from '../../../shared/middlewares/validateRequest.js'; // Importa
import { createGoalSchema, updateGoalSchema, listGoalsSchema } from '../schemas/GoalSchema.js'; // Importa os schemas

const goalRoutes = Router();

goalRoutes.use(ensureAuthenticated);

// Rota para listar todas as metas do usuário
goalRoutes.get('/', validateRequest(listGoalsSchema, 'query'), GoalController.index);

// Rota para criar uma nova meta - com validação
goalRoutes.post('/', validateRequest(createGoalSchema), GoalController.create);

// Rotas para operações em uma meta específica (por ID)
goalRoutes.get('/:id', GoalController.show);
goalRoutes.put('/:id', validateRequest(updateGoalSchema), GoalController.update); // Com validação
goalRoutes.delete('/:id', GoalController.delete);

export default goalRoutes;
