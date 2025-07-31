// src/modules/recurringExpenses/services/RecurringExpenseService.js
import RecurringExpenseRepository from '../repositories/RecurringExpenseRepository.js';
import AccountRepository from '../../accounts/repositories/AccountRepository.js';
import AppError from '../../../shared/errors/AppError.js';

class RecurringExpenseService {
  async getAllRecurringExpenses(userId) {
    return await RecurringExpenseRepository.findAllByUserId(userId);
  }

  async getRecurringExpenseById(expenseId, userId) {
    const expense = await RecurringExpenseRepository.findByIdAndUserId(expenseId, userId);
    if (!expense) {
      throw new AppError('Recurring expense not found or you do not have permission to access it.', 404);
    }
    return expense;
  }

  async createRecurringExpense({ description, amount, category, frequency, dueDate, startDate, endDate, accountId, userId }) {
    // 1. Validar a conta vinculada
    const account = await AccountRepository.findByIdAndUserId(accountId, userId);
    if (!account) {
      throw new AppError('Linked account not found or you do not have permission to access it.', 400);
    }

    // 2. Validações específicas para a frequência
    if (frequency === 'monthly' && (dueDate === undefined || dueDate < 1 || dueDate > 31)) {
        throw new AppError('For "monthly" frequency, "dueDate" (1-31) is required.', 400);
    }
    if (frequency !== 'monthly' && dueDate !== undefined) {
        throw new AppError('"dueDate" is only applicable for "monthly" frequency.', 400);
    }

    const newExpenseData = {
      description,
      amount,
      category,
      frequency,
      dueDate,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      account: accountId,
      user: userId,
      isActive: true,
    };

    const newExpense = await RecurringExpenseRepository.create(newExpenseData);
    return newExpense;
  }

  async updateRecurringExpense(expenseId, userId, updateData) {
    const expense = await RecurringExpenseRepository.findByIdAndUserId(expenseId, userId);
    if (!expense) {
      throw new AppError('Recurring expense not found or you do not have permission to access it.', 404);
    }

    // Se a conta for atualizada, verificar permissão para a nova conta
    if (updateData.accountId && updateData.accountId !== String(expense.account)) {
      const newAccount = await AccountRepository.findByIdAndUserId(updateData.accountId, userId);
      if (!newAccount) {
        throw new AppError('New linked account not found or you do not have permission to access it.', 400);
      }
    }

    // Validações de dueDate e frequency na atualização
    if (updateData.frequency === 'monthly' && (updateData.dueDate === undefined || updateData.dueDate < 1 || updateData.dueDate > 31)) {
        throw new AppError('For "monthly" frequency, "dueDate" (1-31) is required.', 400);
    }
    if (updateData.frequency !== 'monthly' && updateData.dueDate !== undefined) {
        throw new AppError('"dueDate" is only applicable for "monthly" frequency.', 400);
    }


    const updatedExpense = await RecurringExpenseRepository.update(expenseId, userId, updateData);
    return updatedExpense;
  }

  async deleteRecurringExpense(expenseId, userId) {
    const expense = await RecurringExpenseRepository.findByIdAndUserId(expenseId, userId);
    if (!expense) {
      throw new AppError('Recurring expense not found or you do not have permission to access it.', 404);
    }
    await RecurringExpenseRepository.delete(expenseId, userId);
  }
}

export default new RecurringExpenseService();
