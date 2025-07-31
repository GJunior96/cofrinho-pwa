// src/modules/accounts/repositories/AccountRepository.js
import Account from '../models/Account.js';

class AccountRepository {
  async findAllByUserId(userId) {
    // Busca contas pessoais onde o usuário é o owner OU contas conjuntas onde o usuário é um member
    return await Account.find({
      $or: [
        { owner: userId, type: 'personal' },
        { members: userId, type: 'joint' }
      ]
    });
  }

  async findByIdAndUserId(accountId, userId) {
    // Busca uma conta específica, garantindo que o usuário logado seja o owner ou um member
    return await Account.findOne({
      _id: accountId,
      $or: [
        { owner: userId, type: 'personal' },
        { members: userId, type: 'joint' }
      ]
    });
  }

  async create(accountData) {
    const newAccount = new Account(accountData);
    await newAccount.save();
    return newAccount;
  }

  // Métodos para update e delete (adicionaremos no futuro)
  async update(accountId, accountData) {
    return await Account.findByIdAndUpdate(accountId, accountData, { new: true });
  }

  async delete(accountId) {
    await Account.findByIdAndDelete(accountId);
  }
}

export default new AccountRepository();
