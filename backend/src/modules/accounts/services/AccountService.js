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
  // src/modules/accounts/services/AccountService.js

  async updateAccount(accountId, userId, updateData) {
    // 1. Encontrar a conta e verificar permissão
    const account = await AccountRepository.findByIdAndUserId(accountId, userId);
    if (!account) {
      throw new AppError('Account not found or you do not have permission to access it.', 404);
    }

    // 2. Lógica de atualização de membros (se aplicável para contas conjuntas)
    if (account.type === 'joint' && updateData.memberEmails) {
      // Remover duplicatas e filtrar emails vazios
      const uniqueMemberEmails = [...new Set(updateData.memberEmails.filter(email => email))];

      // Encontrar IDs de usuários correspondentes aos novos emails
      const newMemberUsers = await UserRepository.findByEmails(uniqueMemberEmails);
      const newMemberIds = newMemberUsers.map(user => String(user._id));

      // Garantir que o próprio owner da conta conjunta (se for o caso) não seja removido acidentalmente
      // Se o usuário logado for o owner da conta, ele sempre deve permanecer um membro.
      if (!newMemberIds.includes(String(account.owner))) {
         newMemberIds.push(String(account.owner));
      }

      // Atualiza os membros da conta com os novos IDs
      updateData.members = newMemberIds;
      delete updateData.memberEmails; // Remove o campo de emails, já que trabalhamos com IDs
    } else if (account.type === 'personal' && updateData.memberEmails) {
        // Não permitir adição de membros em conta pessoal
        throw new AppError('Cannot add members to a personal account.', 400);
    }


    // 3. Remover campos que não deveriam ser atualizados diretamente pelo usuário
    // Por exemplo, o 'owner' e 'type' da conta não devem ser alterados após a criação.
    delete updateData.owner;
    delete updateData.type;
    // O 'balance' não deve ser alterado diretamente, apenas via transações.
    delete updateData.balance;


    // 4. Realizar a atualização no repositório
    const updatedAccount = await AccountRepository.update(accountId, updateData);

    if (!updatedAccount) {
      // Isso raramente deve acontecer se a conta foi encontrada antes
      throw new AppError('Failed to update account.', 500);
    }

    return updatedAccount;
  }

}

export default new AccountService();
