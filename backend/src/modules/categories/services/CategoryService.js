// src/modules/categories/services/CategoryService.js
import CategoryRepository from '../repositories/CategoryRepository.js';
import AppError from '../../../shared/errors/AppError.js';

class CategoryService {
  async createCategory(userId, name, color) {
    // Verifica se já existe uma categoria com o mesmo nome para o mesmo usuário
    const existingCategory = await CategoryRepository.findOne({ user: userId, name });
    if (existingCategory) {
      throw new AppError('Uma categoria com este nome já existe para este usuário.', 409);
    }
    
    const categoryData = { name, color, user: userId };
    const category = await CategoryRepository.create(categoryData);
    return category;
  }

  async listCategories(userId) {
    const categories = await CategoryRepository.find({ user: userId });
    return categories;
  }

  async updateCategory(userId, categoryId, name, color) {
    const category = await CategoryRepository.findById(categoryId);
    if (!category || category.user.toString() !== userId) {
      throw new AppError('Categoria não encontrada ou você não tem permissão para editá-la.', 404);
    }

    // Verifica se o novo nome já existe para este usuário
    if (name && name !== category.name) {
      const existingCategory = await CategoryRepository.findOne({ user: userId, name });
      if (existingCategory) {
        throw new AppError('Uma categoria com este nome já existe para este usuário.', 409);
      }
    }

    const updatedCategory = await CategoryRepository.update(categoryId, { name, color });
    return updatedCategory;
  }

  async deleteCategory(userId, categoryId) {
    const category = await CategoryRepository.findById(categoryId);
    if (!category || category.user.toString() !== userId) {
      throw new AppError('Categoria não encontrada ou você não tem permissão para deletá-la.', 404);
    }
    
    await CategoryRepository.delete(categoryId);
  }
}

export default new CategoryService();
