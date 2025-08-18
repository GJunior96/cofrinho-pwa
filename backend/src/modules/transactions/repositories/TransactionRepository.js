// src/modules/transactions/repositories/TransactionRepository.js
import Transaction from '../models/Transaction.js';
import paginate from '../../../shared/utils/paginate.js'

class TransactionRepository {
  async find(filter = {}) {
    return await Transaction.find(filter).sort({date: -1});
  }
  
  async findByAccountId(accountId, userId) {
    // Busca transações de uma conta específica que o usuário logado tem acesso
    // (A permissão da conta já foi verificada pelo AccountService antes de chamar o TransactionService)
    return await Transaction.find({ accountId: accountId, user: userId }).sort({ date: -1, createdAt: -1 }); // Ordena por data mais recente
  }

  async findById(transactionId, accountId, userId) {
    // Busca uma transação específica garantindo que pertence à conta e ao usuário
    return await Transaction.findOne({ _id: transactionId, accountId: accountId, user: userId });
  }

  // Novo método para buscar transações com filtros
  async findTransactionsByAccount(accountId, userId, filters = {}) {
    
    const baseQuery = {
	accountId: accountId,
	user: userId
}

// Apenas filtros de transação específicos (fora dos genéricos)
const transactionSpecificFilters = {
	...filters,
	type: filters.type,
	category: filters.category
}

const options = {
	sort: { date: -1, createdAt: -1 }
}

// Usa o utilitário para paginar e filtrar
return paginate(Transaction, baseQuery, transactionSpecificFilters, options);
  }

  async findById(transactionId, accountId, userId) {
    return await Transaction.findOne({ _id: transactionId, account: accountId, user: userId });
  }

  async create(transactionData) {
    const newTransaction = new Transaction(transactionData);
    await newTransaction.save();
    
    return newTransaction;
  }

  async update(transactionId, transactionData) {
    // Apenas para fins de exemplo, permitindo a atualização.
    // Em um sistema real, a atualização de transações pode exigir lógica mais complexa
    // para reajustar saldos, etc.
    return await Transaction.findByIdAndUpdate(transactionId, transactionData, { new: true });
  }

  async delete(transactionId) {
    await Transaction.findByIdAndDelete(transactionId);
  }
}

export default new TransactionRepository();
