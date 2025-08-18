// src/modules/accounts/controllers/AccountController.js
import AccountService from '../services/AccountService.js';
import AppError from '../../../shared/errors/AppError.js';

class AccountController {
  async index(req, res) {
    try {
      const userId = req.user.id; // ID do usuário logado (definido pelo middleware ensureAuthenticated)
      const accounts = await AccountService.getUserAccounts(userId);
      return res.status(200).json(accounts);
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error listing accounts.' });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params; // ID da conta vindo da URL
      const userId = req.user.id; // ID do usuário logado
      const account = await AccountService.getAccountById(id, userId);
      return res.status(200).json(account);
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error retrieving account.' });
    }
  }

  async create(req, res) {
    try {
      const { name, type, memberEmails } = req.body;
      const ownerId = req.user.id; // O criador da conta é o usuário logado

      const newAccount = await AccountService.createAccount({ name, type, ownerId, memberEmails });
      return res.status(201).json(newAccount);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error creating account.' });
    }
  }
  
  async update(req, res) {
  try {
    const { id } = req.params; // ID da conta
    const userId = req.user.id; // Usuário logado
    const updateData = req.body;

    const updatedAccount = await AccountService.updateAccount(id, userId, updateData);
    return res.status(200).json(updatedAccount);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Error updating account.' });
  }
}
}

export default new AccountController();
