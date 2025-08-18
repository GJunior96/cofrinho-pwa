// src/modules/categories/controllers/CategoryController.js
import CategoryService from '../services/CategoryService.js';
import AppError from '../../../shared/errors/AppError.js';

class CategoryController {
  async create(req, res) {
    const { name, color } = req.body;
    const { id } = req.user;
    
    const category = await CategoryService.createCategory(id, name, color);
    return res.status(201).json(category);
  }

  async list(req, res) {
    const { id } = req.user;
    const categories = await CategoryService.listCategories(id);
    return res.status(200).json(categories);
  }

  async update(req, res) {
    const { id } = req.user;
    const { categoryId } = req.params;
    const { name, color } = req.body;

    const updatedCategory = await CategoryService.updateCategory(id, categoryId, name, color);
    return res.status(200).json(updatedCategory);
  }

  async remove(req, res) {
    const { id } = req.user;
    const { categoryId } = req.params;

    await CategoryService.deleteCategory(id, categoryId);
    return res.status(204).send();
  }
}

export default new CategoryController();
