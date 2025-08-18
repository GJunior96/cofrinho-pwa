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

  
  
  async update(req, res) {
    try {
      const { id } = req.params; // ID do usuário a ser atualizado (da URL)
      const userId = req.user.id; // ID do usuário logado (do token)
      const updateData = req.body; // Dados para atualização (do corpo da requisição)

      // Segurança: O usuário só pode atualizar os próprios dados.
      // Se o ID na URL for diferente do ID do usuário logado, retorna 403.
      if (id !== userId) {
        throw new AppError('You are not authorized to update this user.', 403);
      }

      const updatedUser = await UserService.updateUser(id, updateData);

      if (!updatedUser) {
        throw new AppError('User not found or nothing to update.', 404);
      }

      // Retorna o usuário atualizado (removendo a senha por segurança)
      // Em um cenário real, o UserService já deveria retornar sem a senha.
      const { password, ...userWithoutPassword } = updatedUser.toObject();
      return res.status(200).json(userWithoutPassword);

    } catch (error) {
      console.error('Error updating user:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error updating user.' });
    }
  }
/*
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
  }*/
  async getMe(req, res) {
    // req.user foi adicionado pelo nosso middleware
    console.log("aqui e controller");
    return res.status(200).json(req.user);
  }
  
}



export default new UserController();
