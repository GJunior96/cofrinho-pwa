// src/modules/users/repositories/UserRepository.js
import User from '../models/User.js';

class UserRepository {
  async findAll() {
    return await User.find().select('-password'); // Exclui a senha ao buscar
  }
  
  async findOne(query) {
    return await User.findOne(query);
  }

  async findById(id) {
    return await User.findById(id).select('-password');
  }
  
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  // Novo método para buscar por email, **incluindo a senha**
  async findByEmailWithPassword(email) {
    return await User.findOne({ email }).select('+password'); // Inclui a senha aqui
  }

  async create(userData) {
    const newUser = new User(userData);
    await newUser.save();
    const userObject = newUser.toObject();
    delete userObject.password; // Remove a senha do objeto retornado
    return userObject;
  }

  async update(id, userData) {
    return await User.findByIdAndUpdate(id, userData, { new: true }).select('-password');
  }

  async delete(id) {
    await User.findByIdAndDelete(id);
  }
}

export default new UserRepository();
