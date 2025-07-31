// src/modules/goals/repositories/GoalRepository.js
import Goal from '../models/Goal.js';

class GoalRepository {
  async findAllByUserId(userId) {
    // Busca todas as metas do usuário
    return await Goal.find({ user: userId }).sort({ createdAt: -1 });
  }

  async findByIdAndUserId(goalId, userId) {
    // Busca uma meta específica do usuário
    return await Goal.findOne({ _id: goalId, user: userId });
  }

  async create(goalData) {
    const newGoal = new Goal(goalData);
    await newGoal.save();
    return newGoal;
  }

  async update(goalId, userId, updateData) {
    // Atualiza uma meta, garantindo que pertence ao usuário
    const updatedGoal = await Goal.findOneAndUpdate(
      { _id: goalId, user: userId },
      { $set: updateData, updatedAt: Date.now() }, // Usa $set para atualizar apenas os campos fornecidos
      { new: true }
    );
    return updatedGoal;
  }

  async delete(goalId, userId) {
    // Deleta uma meta, garantindo que pertence ao usuário
    await Goal.findOneAndDelete({ _id: goalId, user: userId });
  }
}

export default new GoalRepository();
