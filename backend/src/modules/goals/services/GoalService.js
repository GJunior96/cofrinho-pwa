// src/modules/goals/services/GoalService.js
import GoalRepository from '../repositories/GoalRepository.js';
import AccountRepository from '../../accounts/repositories/AccountRepository.js'; // Para validar se a conta vinculada existe
import AppError from '../../../shared/errors/AppError.js';

class GoalService {
  async getAllGoals(userId, filters = {}) {
    return await GoalRepository.findAllByUserId(userId, filters);
  }

  async getGoalById(goalId, userId) {
    const goal = await GoalRepository.findByIdAndUserId(goalId, userId);
    if (!goal) {
      throw new AppError('Goal not found or you do not have permission to access it.', 404);
    }
    return goal;
  }

  async createGoal({ name, targetAmount, deadline, description, accountId, userId }) {
    if (accountId) {
      // Se uma conta for vinculada, verifica se ela existe e pertence ao usuário
      const account = await AccountRepository.findByIdAndUserId(accountId, userId);
      if (!account) {
        throw new AppError('Linked account not found or you do not have permission to access it.', 400);
      }
    }

    const newGoalData = {
      name,
      targetAmount,
      currentAmount: 0, // Sempre começa em zero
      deadline: deadline ? new Date(deadline) : undefined,
      description,
      account: accountId,
      user: userId,
      isAchieved: false,
    };

    const newGoal = await GoalRepository.create(newGoalData);
    return newGoal;
  }

  async updateGoal(goalId, userId, updateData) {
    const goal = await GoalRepository.findByIdAndUserId(goalId, userId);
    if (!goal) {
      throw new AppError('Goal not found or you do not have permission to access it.', 404);
    }

    // Lógica para atualização do currentAmount ou outros campos
    // Exemplo: se o currentAmount for atualizado para ser igual ou maior que targetAmount
    if (updateData.currentAmount !== undefined && updateData.currentAmount >= goal.targetAmount) {
      updateData.isAchieved = true;
    } else if (updateData.currentAmount !== undefined && updateData.currentAmount < goal.targetAmount && goal.isAchieved) {
      // Se o currentAmount for reduzido abaixo do target, e a meta estava como achieved, desmarca
      updateData.isAchieved = false;
    }

    const updatedGoal = await GoalRepository.update(goalId, userId, updateData);
    return updatedGoal;
  }

  async deleteGoal(goalId, userId) {
    const goal = await GoalRepository.findByIdAndUserId(goalId, userId);
    if (!goal) {
      throw new AppError('Goal not found or you do not have permission to access it.', 404);
    }
    await GoalRepository.delete(goalId, userId);
  }
}

export default new GoalService();
