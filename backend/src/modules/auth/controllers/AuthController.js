// src/modules/auth/controllers/AuthController.js
import AuthService from '../services/AuthService.js';
import AppError from '../../../shared/errors/AppError.js';

class AuthController {
  // ... (outros métodos)
  
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const newUser = await UserService.register({ name, email, password });
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
      const { user, token } = await AuthService.authenticateUser({ email, password });
      return res.status(200).json({ user, token });
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error authenticating user' });
    }
  }
  
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const resetToken = await AuthService.forgotPassword(email);

      // POR ENQUANTO: Apenas mostramos o token no console para fins de teste.
      // Em uma aplicação real, você enviaria este token por e-mail ao usuário.
      
      return res.status(200).json({ message: 'Password reset token sent to email.', resetToken });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error processing password reset request.' });
    }
  }
  
  async resetPassword(req, res) {
	try {
		const { token, password } = req.body;
		const result = await AuthService.resetPassword(token, password);
		return res.status(200).json(result);
	} catch (error) {
		if(error instanceof AppError) {
			return res.status(error.statusCode).json({ message: error.message });
		}
	return res.status(500).json({ message: 'Error processing password reset.' });
	}
}
}

export default new AuthController();
