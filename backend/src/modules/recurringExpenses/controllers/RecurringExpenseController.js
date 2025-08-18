// src/modules/recurringExpenses/controllers/RecurringExpenseController.js
import RecurringExpenseService from '../services/RecurringExpenseService.js';
import AppError from '../../../shared/errors/AppError.js';

class RecurringExpenseController {
  async index(req, res) {
    try {
      const userId = req.user.id;
      const filters = req.query;
      
      const paginationResult = await RecurringExpenseService.getAllRecurringExpenses(userId, filters);

      return res.status(200).json(paginationResult);
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error listing recurring expenses.' });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const expense = await RecurringExpenseService.getRecurringExpenseById(id, userId);
      return res.status(200).json(expense);
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error retrieving recurring expense.' });
    }
  }

  async create(req, res) {
    try {
      const { description, amount, category, frequency, dueDate, startDate, endDate, accountId } = req.body;
      const userId = req.user.id;

      const newExpense = await RecurringExpenseService.createRecurringExpense({
        description,
        amount,
        category,
        frequency,
        dueDate,
        startDate,
        endDate,
        accountId,
        userId,
      });
      return res.status(201).json(newExpense);
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error creating recurring expense.' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      const updatedExpense = await RecurringExpenseService.updateRecurringExpense(id, userId, updateData);
      return res.status(200).json(updatedExpense);
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error updating recurring expense.' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await RecurringExpenseService.deleteRecurringExpense(id, userId);
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error deleting recurring expense.' });
    }
  }
}

export default new RecurringExpenseController();
