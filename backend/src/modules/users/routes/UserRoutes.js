// src/modules/users/routes/user.routes.js
import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import ensureAuthenticated from '../../../shared/middlewares/ensureAuthenticated.js'; // Importa o middleware

const userRoutes = Router();

// Rota para criar um novo usuário (registro) - NÃO precisa de autenticação
userRoutes.post('/', UserController.create);

// Rota para autenticar um usuário (login) - NÃO precisa de autenticação
userRoutes.post('/auth', UserController.authenticate);

// Rota para listar todos os usuários - AGORA PRECISA DE AUTENTICAÇÃO
// O middleware 'ensureAuthenticated' é executado antes do UserController.index
userRoutes.get('/', ensureAuthenticated, UserController.index);

// Exemplo futuro: Rota para buscar um usuário por ID (também protegida)
// userRoutes.get('/:id', ensureAuthenticated, UserController.show);

export default userRoutes;
