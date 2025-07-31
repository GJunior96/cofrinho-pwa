// src/modules/goals/routes/goal.routes.js
import { Router } from 'express';
import GoalController from '../controllers/GoalController.js';
import ensureAuthenticated from '../../../shared/middlewares/ensureAuthenticated.js';

const goalRoutes = Router();

// Todas as rotas de metas devem ser protegidas
goalRoutes.use(ensureAuthenticated);

// Rota para listar todas as metas do usuário
goalRoutes.get('/', GoalController.index);

// Rota para criar uma nova meta
goalRoutes.post('/', GoalController.create);

// Rotas para operações em uma meta específica (por ID)
goalRoutes.get('/:id', GoalController.show);
goalRoutes.put('/:id', GoalController.update);
goalRoutes.delete('/:id', GoalController.delete);

export default goalRoutes;
