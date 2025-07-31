// src/modules/accounts/services/AccountService.js
import AccountRepository from '../repositories/AccountRepository.js';
import AppError from '../../../shared/errors/AppError.js';
import UserRepository from '../../../modules/users/repositories/UserRepository.js'; // Precisaremos para validar membros

class AccountService {
  async getUserAccounts(userId) {
    return await AccountRepository.findAllByUserId(userId);
  }

  async getAccountById(accountId, userId) {
    const account = await AccountRepository.findByIdAndUserId(accountId, userId);
    if (!account) {
      throw new AppError('Account not found or you do not have permission to access it.', 404);
    }
    return account;
  }

  async createAccount({ name, type, ownerId, memberEmails = [] }) {
    if (type === 'personal') {
      // Para conta pessoal, o ownerId deve ser o próprio criador
      const accountData = { name, type, owner: ownerId };
      return await AccountRepository.create(accountData);
    } else if (type === 'joint') {
      // Para conta conjunta, valida os membros e adiciona o criador como membro
      const membersIds = [];
      const creatorUser = await UserRepository.findById(ownerId); // O criador já é um membro
      if (!creatorUser) {
        throw new AppError('Creator user not found.', 400);
      }
      membersIds.push(creatorUser._id);

      for (const email of memberEmails) {
        if (email === creatorUser.email) continue; // Evita adicionar o criador duas vezes
        const member = await UserRepository.findByEmailWithPassword(email);
        if (!member) {
          throw new AppError(`Member with email ${email} not found.`, 400);
        }
        membersIds.push(member._id);
      }

      if (membersIds.length < 2) {
          throw new AppError('Joint account must have at least two valid members.', 400);
      }

      const accountData = { name, type, members: [...new Set(membersIds)] }; // Remove duplicatas
      return await AccountRepository.create(accountData);

    } else {
      throw new AppError('Invalid account type. Must be "personal" or "joint".', 400);
    }
  }

  // Futuramente, métodos para atualizar saldo, adicionar/remover membros, etc.
}

export default new AccountService();
