// src/modules/reports/routes/report.routes.js
import { Router } from 'express';
import ReportController from '../controllers/ReportController.js';
import { authMiddleware } from '../../auth/middlewares/authMiddleware.js';

const reportRoutes = Router();

// Rota protegida que retorna o resumo financeiro do usuário
reportRoutes.get('/dashboard-summary', authMiddleware, ReportController.getDashboardSummary);

// Nova rota para despesas por categoria
reportRoutes.get('/expenses-by-category', authMiddleware, ReportController.getExpensesByCategory);

// Nova rota para a evolução do saldo
reportRoutes.get('/balance-evolution', authMiddleware, ReportController.getBalanceEvolution);

export default reportRoutes;
