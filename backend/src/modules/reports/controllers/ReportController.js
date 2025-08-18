// src/modules/reports/controllers/ReportController.js
import ReportService from '../services/ReportService.js';
import AppError from '../../../shared/errors/AppError.js';

class ReportController {
  async getDashboardSummary(req, res) {
    try {
      const { id } = req.user; // O ID do usuário é anexado à requisição pelo middleware
      const { startDate, endDate } = req.query;

      if (!id) {
        throw new AppError('Usuário não autenticado.', 401);
      }

      const summary = await ReportService.getFinancialSummary(id, startDate, endDate);
      return res.status(200).json(summary);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
  
  async getExpensesByCategory(req, res) {
    try {
      const { id } = req.user;
      const { startDate, endDate } = req.query;
      const expensesByCategory = await ReportService.getExpensesByCategory(id, startDate, endDate);
      return res.status(200).json(expensesByCategory);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
  
  async getBalanceEvolution(req, res) {
    try {
      const { id } = req.user;
      const { months } = req.query;
      const balanceEvolution = await ReportService.getBalanceEvolution(id, months);
      return res.status(200).json(balanceEvolution);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

export default new ReportController();
