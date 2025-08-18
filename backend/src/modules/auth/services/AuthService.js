// src/modules/auth/services/AuthService.js
import {createEmailService} from '../../shared/services/EmailService.js'
import UserRepository from '../../users/repositories/UserRepository.js';
import AppError from '../../../shared/errors/AppError.js';
import crypto from 'crypto'; // <-- Módulo nativo do Node.js para criptografia
import jwt from 'jsonwebtoken';
import authConfig from '../../../config/auth.js'
// ... (outros imports)

class AuthService {
  // ... (outros métodos como register e authenticate)
 // console.log("JWT Secret para criação:", process.env.JWT_SECRET);
  async register({ name, email, password }) {
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

const secret = authConfig.jwt.secret;
const token = jwt.sign({ id: user._id }, secret, {
      expiresIn: authConfig.jwt.expiresIn,
    });
    
    global.__lastGeneratedToken = token; // <-- salvando para debug
const cleanedToken = token.trim();
    const userObject = user.toObject(); // Converte para objeto JS puro
    delete userObject.password; // Remove a senha antes de retornar

    return { user: userObject, token };
  }
  

  async forgotPassword(email) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new AppError('User with this email not found.', 404);
    }

    // 1. Gera um token aleatório e seguro
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 2. Hash do token antes de salvar no banco
    // Isso garante que mesmo que o banco seja comprometido, o token original não é revelado

    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // 3. Salva o token e a data de expiração no usuário
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 3600000; // Expira em 1 hora

    await user.save();
    // 4. Retorna o token não-criptografado para ser enviado ao usuário (por e-mail, por exemplo)
    const resetURL = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
    const emailContent = `
        <h2>Redefinição de Senha</h2>
        <p>Olá,</p>
        <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para criar uma nova senha:</p>
        <a href="${resetURL}" style="display:inline-block; padding:10px 20px; color:#fff; background-color:#007BFF; text-decoration:none; border-radius:5px;">Redefinir Minha Senha</a>
        <p>Este link de redefinição de senha é válido por 10 minutos.</p>
        <p>Se você não solicitou a redefinição, por favor, ignore este e-mail.</p>
    `;

    try {
        const emailService = createEmailService();
        await emailService.sendMail(user.email, 'Redefinição de Senha', emailContent);
        return { message: 'Link de redefinição de senha enviado para o seu e-mail.' };
    } catch (error) {
        console.error("Falha ao enviar o e-mail de redefinição:", error);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        throw new AppError('Houve uma falha no envio do e-mail. Tente novamente mais tarde.', 500);
    }
  }

  async resetPassword(token,password) {
  	const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  	const user = await UserRepository.findOne({
  		passwordResetToken: hashedToken,
  		passwordResetExpires: { $gt: Date.now() },
  	});

  	if(!user) {
  		throw new AppError('Token de redefinição de senha inválido ou expirado', 400);
  	}
  
  /*	
  	 // 1. Apenas encontre o usuário pelo token, sem a data

    const user = await UserRepository.findOne({
        passwordResetToken: hashedToken,
    });

    // 2. Verifique se o usuário existe E se o token não expirou
    if (!user || user.passwordResetExpires < Date.now()) {
        throw new AppError('Token de redefinição de senha inválido ou expirado.', 400);
    }
  */
  	user.password = password;
  	user.passwordResetToken = undefined;
  	user.passwordResetExpires = undefined;
  	await user.save();

  	return { message: 'Senha redefinida com sucesso!' };
  }

  // ... (outros métodos)
}

export default new AuthService();
