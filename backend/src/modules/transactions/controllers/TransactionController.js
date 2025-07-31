// src/modules/transactions/controllers/TransactionController.js
import TransactionService from '../services/TransactionService.js';
import AppError from '../../../shared/errors/AppError.js';

class TransactionController {
  async create(req, res) {
    try {
      const { description, amount, type, date, accountId, category } = req.body;
      const userId = req.user.id; // ID do usuário logado

      const newTransaction = await TransactionService.createTransaction({
        description,
        amount,
        type,
        date,
        accountId,
        userId,
        category,
      });

      return res.status(201).json(newTransaction);
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error creating transaction.' });
    }
  }

  async indexByAccount(req, res) {
    try {
      const { accountId } = req.params; // ID da conta vindo da URL
      const userId = req.user.id; // ID do usuário logado

      const transactions = await TransactionService.getTransactionsByAccount(accountId, userId);
      return res.status(200).json(transactions);
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error listing transactions.' });
    }
  }

  async show(req, res) {
    try {
      const { accountId, transactionId } = req.params; // IDs da conta e transação
      const userId = req.user.id; // ID do usuário logado

      const transaction = await TransactionService.getTransactionById(transactionId, accountId, userId);
      return res.status(200).json(transaction);
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error retrieving transaction.' });
    }
  }
}

export default new TransactionController();
