// src/modules/transactions/services/TransactionService.js
import TransactionRepository from '../repositories/TransactionRepository.js';
import AccountRepository from '../../accounts/repositories/AccountRepository.js'; // Precisamos para atualizar o saldo
import AppError from '../../../shared/errors/AppError.js';

class TransactionService {
  async createTransaction({ description, amount, type, date, accountId, userId, category }) {
    // 1. Verificar se a conta existe e pertence ao usuário logado
    const account = await AccountRepository.findByIdAndUserId(accountId, userId);
    if (!account) {
      throw new AppError('Account not found or you do not have permission to access it.', 404);
    }

    // 2. Criar a transação
    const transactionData = {
      description,
      amount,
      type,
      date: date ? new Date(date) : undefined, // Usa a data fornecida ou a padrão
      account: accountId,
      user: userId,
      category,
    };
    const newTransaction = await TransactionRepository.create(transactionData);

    // 3. Atualizar o saldo da conta
    let newBalance = account.balance;
    if (type === 'income') {
      newBalance += amount;
    } else if (type === 'expense') {
      newBalance -= amount;
    } else {
      // Isso já deveria ser pego pelo enum no modelo, mas é uma segurança extra
      throw new AppError('Invalid transaction type. Must be "income" or "expense".', 400);
    }

    await AccountRepository.update(accountId, { balance: newBalance });

    return newTransaction;
  }

  async getTransactionsByAccount(accountId, userId) {
    // 1. Verificar se a conta existe e pertence ao usuário logado
    const account = await AccountRepository.findByIdAndUserId(accountId, userId);
    if (!account) {
      throw new AppError('Account not found or you do not have permission to access it.', 404);
    }

    // 2. Retornar as transações
    return await TransactionRepository.findByAccountId(accountId, userId);
  }

  async getTransactionById(transactionId, accountId, userId) {
    // 1. Verificar se a conta existe e pertence ao usuário logado
    const account = await AccountRepository.findByIdAndUserId(accountId, userId);
    if (!account) {
      throw new AppError('Account not found or you do not have permission to access it.', 404);
    }

    // 2. Buscar a transação
    const transaction = await TransactionRepository.findById(transactionId, accountId, userId);
    if (!transaction) {
      throw new AppError('Transaction not found or you do not have permission to access it.', 404);
    }
    return transaction;
  }

  // Futuramente: Lógica para atualização e exclusão que também ajustariam o saldo
}

export default new TransactionService();
