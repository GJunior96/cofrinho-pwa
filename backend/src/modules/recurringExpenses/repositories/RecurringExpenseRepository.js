// src/modules/recurringExpenses/repositories/RecurringExpenseRepository.js
import RecurringExpense from '../models/RecurringExpense.js';

class RecurringExpenseRepository {
  async findAllByUserId(userId) {
    // Busca todas as despesas recorrentes do usuário
    return await RecurringExpense.find({ user: userId }).sort({ createdAt: -1 });
  }

  async findByIdAndUserId(expenseId, userId) {
    // Busca uma despesa recorrente específica do usuário
    return await RecurringExpense.findOne({ _id: expenseId, user: userId });
  }

  async create(expenseData) {
    const newExpense = new RecurringExpense(expenseData);
    await newExpense.save();
    return newExpense;
  }

  async update(expenseId, userId, updateData) {
    const updatedExpense = await RecurringExpense.findOneAndUpdate(
      { _id: expenseId, user: userId },
      { $set: updateData, updatedAt: Date.now() },
      { new: true }
    );
    return updatedExpense;
  }

  async delete(expenseId, userId) {
    await RecurringExpense.findOneAndDelete({ _id: expenseId, user: userId });
  }
}

export default new RecurringExpenseRepository();
