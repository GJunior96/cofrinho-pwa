// src/jobs/checkRecurringExpensesJob.js
import cron from 'node-cron';
import RecurringExpenseRepository from '../modules/recurringExpenses/repositories/RecurringExpenseRepository.js';
import TransactionService from '../modules/transactions/services/TransactionService.js';
import AppError from '../shared/errors/AppError.js';

const checkRecurringExpensesJob = () => {
  // Agenda o job para rodar todo dia à 00:01
  cron.schedule('1 0 * * *', async () => {
    console.log('--- Executando job de despesas recorrentes ---');

    try {
      const today = new Date();

      // Busca todas as despesas recorrentes que vencem hoje
      // A nova função do repositório é chamada com a data completa
      const dueExpenses = await RecurringExpenseRepository.findDueToday(today);
      console.log(`Encontradas ${dueExpenses.length} despesas recorrentes vencendo hoje.`);

      // Para cada despesa, cria uma nova transação
      for (const expense of dueExpenses) {
        const transactionData = {
          description: expense.description,
          amount: expense.amount,
          type: 'expense',
          category: expense.category,
          date: today,
          accountId: expense.accountId,
        };

        await TransactionService.createTransaction(expense.user, transactionData);
        console.log(`Transação criada para a despesa: ${expense.description}`);
      }

      console.log('--- Job de despesas recorrentes finalizado ---');

    } catch (error) {
      console.error('Erro no job de despesas recorrentes:', error);
    }
  }, {
    timezone: "America/Sao_Paulo"
  });
};

export default checkRecurringExpensesJob;
