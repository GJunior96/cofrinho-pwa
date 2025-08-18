// src/modules/auth/routes/auth.routes.js
import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';
// ... (outros imports)

const authRouter = Router();

authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.authenticate);
authRouter.post('/forgot-password', AuthController.forgotPassword); // <-- Nova rota
authRouter.post('/reset-password', AuthController.resetPassword)
// ... (outras rotas)

export default authRouter;

