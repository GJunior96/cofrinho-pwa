// src/modules/users/routes/user.routes.js
import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import ensureAuthenticated from '../../../shared/middlewares/ensureAuthenticated.js';
import validateRequest from '../../../shared/middlewares/validateRequest.js'; // Importa
import { createUserSchema, authenticateUserSchema, updateUserSchema } from '../schemas/UserSchema.js'; // Importa os schemas
import { authMiddleware } from '../../auth/middlewares/authMiddleware.js'

const userRoutes = Router();

// A rota GET /me agora requer que o usuário esteja autenticado
userRoutes.get('/me', authMiddleware, UserController.getMe);

// Rota para criar um novo usuário (registro) - com validação
/*userRoutes.post('/', validateRequest(createUserSchema), UserController.create);*/

// Rota para autenticar um usuário (login) - com validação
/*userRoutes.post('/auth', validateRequest(authenticateUserSchema), UserController.authenticate);*/

// Rota para listar todos os usuários - protegida
userRoutes.get('/', ensureAuthenticated, UserController.index);

// Rota para atualizar usuário (exemplo) - protegida e com validação
userRoutes.put('/:id', ensureAuthenticated, validateRequest(updateUserSchema), UserController.update); // Adicione se você tiver um update no controller
// Adicione um método update no UserController se não tiver!
/*
// Exemplo de update no UserController (se você não tiver ainda)
async update(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Usuário logado
    const updateData = req.body;

    // Apenas permitir que o usuário atualize seus próprios dados
    if (id !== userId) {
      throw new AppError('You are not authorized to update this user.', 403); // Forbidden
    }

    const updatedUser = await UserService.updateUser(id, updateData);
    if (!updatedUser) {
      throw new AppError('User not found.', 404);
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Error updating user.' });
  }
}
*/

export default userRoutes;
