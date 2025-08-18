// src/modules/reports/services/ReportService.js
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';
import TransactionRepository from '../../transactions/repositories/TransactionRepository.js';
import AppError from '../../../shared/errors/AppError.js';

class ReportService {
  async getFinancialSummary(userId, startDate, endDate) {
    if (!userId) {
      throw new AppError('ID do usuário não fornecido.', 400);
    }

   // Se as datas não forem fornecidas, define o período como o mês atual
    const periodStartDate = startDate || startOfMonth(new Date());
    const periodEndDate = endDate || endOfMonth(new Date());

    // Agora usamos o método genérico 'find' com um objeto de filtro
    const transactions = await TransactionRepository.find({
      user: userId,
      date: {
        $gte: periodStartDate,
        $lte: periodEndDate
      }
    });

    if (!transactions || transactions.length === 0) {
      return {
        balance: 0,
        totalIncome: 0,
        totalExpense: 0
      };
    }

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else if (transaction.type === 'expense') {
        totalExpense += transaction.amount;
      }
    });

    const balance = totalIncome - totalExpense;

    return {
      balance,
      totalIncome,
      totalExpense
    };
  }
  
  async getExpensesByCategory(userId, startDate, endDate) {
    if (!userId) {
      throw new AppError('ID do usuário não fornecido.', 400);
    }

   // Se as datas não forem fornecidas, define o período como o mês atual
    const periodStartDate = startDate || startOfMonth(new Date());
    const periodEndDate = endDate || endOfMonth(new Date());

    // Buscar apenas as transações de despesa do mês atual
    const expenses = await TransactionRepository.find({
      user: userId,
      type: 'expense', // Adiciona o filtro por tipo
      date: {
        $gte: periodStartDate,
        $lte: periodEndDate,
      },
    });

    // Se não houver despesas, retorna um array vazio
    if (!expenses || expenses.length === 0) {
      return [];
    }

    // Agrupar as despesas por categoria e somar os valores
    const expensesByCategory = expenses.reduce((accumulator, currentExpense) => {
      const { category, amount } = currentExpense;

      if (!accumulator[category]) {
        accumulator[category] = 0;
      }
      accumulator[category] += amount;

      return accumulator;
    }, {});

    // Formatar o resultado para ser uma lista de objetos
    const formattedResult = Object.keys(expensesByCategory).map(category => ({
      category,
      totalAmount: expensesByCategory[category],
    }));

    return formattedResult;
  }
  
  async getBalanceEvolution(userId, months = 6) {
    if (!userId) {
      throw new AppError('ID do usuário não fornecido.', 400);
    }

   // Converte a quantidade de meses para um número inteiro
    const numberOfMonths = parseInt(months, 10);
    if (isNaN(numberOfMonths) || numberOfMonths <= 0) {
      throw new AppError('O número de meses deve ser um valor inteiro positivo.', 400);
    }

    const today = new Date();
    const monthlyBalances = [];

    // Calcular o saldo para os últimos 6 meses
    for (let i = numberOfMonths; i >= 0; i--) {
      const month = subMonths(today, i);
      const startDate = startOfMonth(month);
      const endDate = endOfMonth(month);

      const transactions = await TransactionRepository.find({
        user: userId,
        date: {
          $gte: startDate,
          $lte: endDate
        }
      });

      let totalIncome = 0;
      let totalExpense = 0;

      transactions.forEach(transaction => {
        if (transaction.type === 'income') {
          totalIncome += transaction.amount;
        } else {
          totalExpense += transaction.amount;
        }
      });

      const balance = totalIncome - totalExpense;

      monthlyBalances.push({
        month: format(month, 'yyyy-MM'),
        balance
      });
    }

    return monthlyBalances;
  }
}

export default new ReportService();
