// src/modules/recurringExpenses/repositories/RecurringExpenseRepository.js
import RecurringExpense from '../models/RecurringExpense.js';
import paginate from '../../../shared/utils/paginate.js'

class RecurringExpenseRepository {
  async findAllByUserId(userId, filters = {}) {
    // Busca todas as despesas recorrentes do usuário
    const baseQuery = { user: userId };
const recurringExpenseSpecificFilters = {
	...filters,
	isActive: filters.isActive,
	category: filters.category,
	frequency: filters.frequency,
};
const options = {
	sort: { createdAt: -1 },
};

// Chama o utilitário de paginação
return paginate(RecurringExpense, baseQuery, recurringExpenseSpecificFilters, options);
    
  }

  async findByIdAndUserId(expenseId, userId) {
    // Busca uma despesa recorrente específica do usuário
    return await RecurringExpense.findOne({ _id: expenseId, user: userId });
  }
  
  async findDueToday(date) {
    const today = new Date(date);
    today.setHours(0, 0, 0, 0); // Zera o horário para a comparação
    
    const dayOfMonth = today.getDate();
    const dayOfWeek = today.getDay(); // 0 = Domingo, 1 = Segunda...
    const month = today.getMonth() + 1; // Mês é 0-11
    const day = today.getDate();
    const monthAndDay = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    return await RecurringExpense.find({
      isActive: true, // Apenas despesas ativas
      $or: [
        { startDate: { $lte: today } },
        { startDate: { $exists: false } }
      ],
      $or: [
        { endDate: { $gte: today } },
        { endDate: { $exists: false } }
      ],
      $or: [
        { frequency: 'daily' },
        { frequency: 'weekly', dueDate: dayOfWeek },
        { frequency: 'monthly', dueDate: dayOfMonth },
        { frequency: 'yearly', dueDate: monthAndDay },
      ],
    });
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
