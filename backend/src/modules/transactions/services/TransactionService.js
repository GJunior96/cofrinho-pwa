// src/modules/transactions/services/TransactionService.js
import TransactionRepository from '../repositories/TransactionRepository.js';
import AccountRepository from '../../accounts/repositories/AccountRepository.js'; // Precisamos para atualizar o saldo
import AppError from '../../../shared/errors/AppError.js';

class TransactionService {
  async createTransaction(/*{ description, amount, type, date, accountId, userId, category }*/ userId, transactionData) {
    
    // 1. Verificar se a conta existe e pertence ao usuário logado
    const account = await AccountRepository.findByIdAndUserId(transactionData.accountId, userId);
    if (!account) {
      throw new AppError('Account not found or you do not have permission to access it.', 404);
    }
    
    // 2. Criar a transação
    /*const transactionData = {
      description,
      amount,
      type,
      date: date ? new Date(date) : undefined, // Usa a data fornecida ou a padrão
      account: accountId,
      user: userId,
      category,
    };*/
    /*const newTransaction = await TransactionRepository.create(transactionData);*/
    const dataToSave = { ...transactionData, user: userId }
console.log(dataToSave);
console.log(transactionData);
    // 3. Atualizar o saldo da conta
    let newBalance = account.balance;
    if (transactionData.type === 'income') {
      newBalance += transactionData.amount;
    } else if (transactionData.type === 'expense') {
      newBalance -= transactionData.amount;
    } else {
      // Isso já deveria ser pego pelo enum no modelo, mas é uma segurança extra
      throw new AppError('Invalid transaction type. Must be "income" or "expense".', 400);
    }

    const newTransaction = await TransactionRepository.create(dataToSave);
    
    await AccountRepository.update(transactionData.accountId, { balance: newBalance });
    
    return newTransaction;
  }

  async getTransactionsByAccount(accountId, userId, filters = {}) {
    // 1. Verificar se a conta existe e pertence ao usuário logado
    const account = await AccountRepository.findByIdAndUserId(accountId, userId);
    if (!account) {
      throw new AppError('Account not found or you do not have permission to access it.', 404);
    }

    // 2. Retornar as transações
    return await TransactionRepository.findTransactionsByAccount(accountId, userId, filters);
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
  
  // src/modules/transactions/services/TransactionService.js

  async updateTransaction(transactionId, accountId, userId, updateData) {
    // 1. Verificar se a conta existe e pertence ao usuário logado
    const account = await AccountRepository.findByIdAndUserId(accountId, userId);
    if (!account) {
      throw new AppError('Account not found or you do not have permission to access it.', 404);
    }

    // 2. Encontrar a transação original
    const originalTransaction = await TransactionRepository.findById(transactionId, accountId, userId);
    if (!originalTransaction) {
      throw new AppError('Transaction not found or you do not have permission to access it.', 404);
    }

    // Preparar os novos dados, garantindo que 'amount' e 'type' sejam números/strings, se existirem
    const newAmount = updateData.amount !== undefined ? updateData.amount : originalTransaction.amount;
    const newType = updateData.type || originalTransaction.type;
    const newAccountId = updateData.accountId || originalTransaction.account; // Caso a conta da transação seja alterada (mais complexo, tratado abaixo)

    // --- Lógica de Reajuste do Saldo ---

    // 3. Reverter o impacto da transação original no saldo da CONTA ORIGINAL
    let currentBalance = account.balance;

    if (originalTransaction.type === 'income') {
      currentBalance -= originalTransaction.amount; // Se era uma receita, subtrai
    } else if (originalTransaction.type === 'expense') {
      currentBalance += originalTransaction.amount; // Se era uma despesa, adiciona de volta
    }

    // 4. Aplicar o impacto da transação ATUALIZADA no saldo da CONTA (pode ser a mesma ou nova)
    // Se a conta da transação for alterada, o saldo da conta original precisa ser ajustado e o da nova conta também.
    // Esta é uma lógica mais avançada e exige cuidado. Por simplicidade, vamos assumir
    // que accountId no updateData é a mesma conta da transação, ou que a atualização é apenas
    // de descrição/valor/tipo, mas não da conta em si.
    // Se a `accountId` for diferente, o ideal seria:
    // a) Reverter da conta original
    // b) Encontrar a nova conta e verificar permissão
    // c) Aplicar na nova conta.
    // Por enquanto, vamos manter o foco na atualização de valores/tipos na MESMA CONTA.

    if (newType === 'income') {
      currentBalance += newAmount; // Se é uma nova receita, adiciona
    } else if (newType === 'expense') {
      currentBalance -= newAmount; // Se é uma nova despesa, subtrai
    } else {
      throw new AppError('Invalid transaction type for update. Must be "income" or "expense".', 400);
    }

    // 5. Atualizar a transação no banco de dados
    const updatedTransaction = await TransactionRepository.update(transactionId, updateData);
    if (!updatedTransaction) {
      // Isso raramente deveria acontecer se originalTransaction foi encontrado
      throw new AppError('Failed to update transaction.', 500);
    }

    // 6. Atualizar o saldo da conta
    await AccountRepository.update(account._id, { balance: currentBalance });

    return updatedTransaction;
  }

  // Futuramente: Lógica para exclusão que também ajustariam o saldo
  // (Você precisará de uma função delete no TransactionService que reverta o impacto da transação)

}

export default new TransactionService();
