// src/modules/categories/repositories/CategoryRepository.js
import Category from '../models/Category.js';

class CategoryRepository {
  async create(categoryData) {
    const category = new Category(categoryData);
    await category.save();
    return category;
  }

  async find(filter = {}) {
    return Category.find(filter).sort({ name: 1 });
  }

  async findOne(filter = {}) {
    return Category.findOne(filter);
  }

  async findById(categoryId) {
    return Category.findById(categoryId);
  }

  async update(categoryId, updateData) {
    return Category.findByIdAndUpdate(categoryId, updateData, { new: true });
  }

  async delete(categoryId) {
    return Category.findByIdAndDelete(categoryId);
  }
}

export default new CategoryRepository();
