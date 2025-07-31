// src/modules/users/controllers/UserController.js
import UserService from '../services/UserService.js';
import AppError from '../../../shared/errors/AppError.js'; // Importa a classe de erro

class UserController {
  async index(req, res) {
    try {
      const users = await UserService.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      console.error(error); // Para depuração
      return res.status(500).json({ message: 'Error listing users' });
    }
  }

  async create(req, res) {
    try {
      const { name, email, password } = req.body;
      const newUser = await UserService.createUser({ name, email, password });
      return res.status(201).json(newUser); // 201 Created
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error creating user' });
    }
  }

  async authenticate(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token } = await UserService.authenticateUser({ email, password });
      return res.status(200).json({ user, token });
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error authenticating user' });
    }
  }
}

export default new UserController();
