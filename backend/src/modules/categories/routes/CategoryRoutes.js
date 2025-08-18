// src/modules/categories/routes/category.routes.js
import { Router } from 'express';
import CategoryController from '../controllers/CategoryController.js';
import { authMiddleware } from '../../auth/middlewares/authMiddleware.js';
import validateRequest from '../../../shared/middlewares/validateRequest.js'; // Ajuste o caminho se necessário
import { createCategorySchema, updateCategorySchema } from '../schemas/CategorySchema.js';

const categoryRoutes = Router();

// Rotas protegidas por autenticação
categoryRoutes.use(authMiddleware);

// Rota para criar uma nova categoria (com validação)
categoryRoutes.post('/', validateRequest(createCategorySchema), CategoryController.create);

// Rota para listar todas as categorias do usuário
categoryRoutes.get('/', CategoryController.list);

// Rota para atualizar uma categoria (com validação)
categoryRoutes.put('/:categoryId', validateRequest(updateCategorySchema), CategoryController.update);

// Rota para remover uma categoria
categoryRoutes.delete('/:categoryId', CategoryController.remove);

export default categoryRoutes;
