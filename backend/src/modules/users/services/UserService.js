// src/modules/users/services/UserService.js
import UserRepository from '../repositories/UserRepository.js';
import AppError from '../../../shared/errors/AppError.js'; // Importa a classe de erro
import jwt from 'jsonwebtoken';
import authConfig from '../../../config/auth.js';

class UserService {
  async getAllUsers() {
    return await UserRepository.findAll();
  }

  async getUserById(id) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new AppError('User not found.', 404);
    }
    return user;
  }

  async createUser({ name, email, password }) {
    const userExists = await UserRepository.findByEmailWithPassword(email);

    if (userExists) {
      throw new AppError('Email address already used.', 409); // 409 Conflict
    }

    const newUser = await UserRepository.create({ name, email, password });
    return newUser;
  }

  async authenticateUser({ email, password }) {
    const user = await UserRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new AppError('Incorrect email or password.', 401); // 401 Unauthorized
    }

    const passwordMatched = await user.comparePassword(password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email or password.', 401);
    }

    const token = jwt.sign({ id: user._id }, authConfig.jwt.secret, {
      expiresIn: authConfig.jwt.expiresIn,
    });

    const userObject = user.toObject(); // Converte para objeto JS puro
    delete userObject.password; // Remove a senha antes de retornar

    return { user: userObject, token };
  }
}

export default new UserService();
