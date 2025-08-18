// src/modules/goals/controllers/GoalController.js
import GoalService from '../services/GoalService.js';
import AppError from '../../../shared/errors/AppError.js';

class GoalController {
  async index(req, res) {
    try {
      const userId = req.user.id;
      const filters = req.query;
      
      const paginationResult = await GoalService.getAllGoals(userId, filters);
      return res.status(200).json(paginationResult);
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error listing goals.' });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const goal = await GoalService.getGoalById(id, userId);
      return res.status(200).json(goal);
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error retrieving goal.' });
    }
  }

  async create(req, res) {
    try {
      const { name, targetAmount, deadline, description, accountId } = req.body;
      const userId = req.user.id;

      const newGoal = await GoalService.createGoal({
        name,
        targetAmount,
        deadline,
        description,
        accountId,
        userId,
      });
      return res.status(201).json(newGoal);
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error creating goal.' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updateData = req.body; // Pega todos os dados enviados para atualização

      const updatedGoal = await GoalService.updateGoal(id, userId, updateData);
      return res.status(200).json(updatedGoal);
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error updating goal.' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await GoalService.deleteGoal(id, userId);
      return res.status(204).send(); // 204 No Content para deleção bem-sucedida
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error deleting goal.' });
    }
  }
}

export default new GoalController();
