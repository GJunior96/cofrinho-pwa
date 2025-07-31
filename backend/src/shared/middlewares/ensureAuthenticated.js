// src/shared/middlewares/ensureAuthenticated.js
import pkg from 'jsonwebtoken';
const { verify } = pkg;

//import { verify } from 'jsonwebtoken'; // Importa a função verify do jsonwebtoken
import AppError from '../errors/AppError.js'; // Importa sua classe de erro customizada
import authConfig from '../../config/auth.js'; // Importa as configurações do JWT

export default function ensureAuthenticated(req, res, next) {
  // Pega o token do cabeçalho de autorização
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    throw new AppError('JWT Token is missing.', 401); // 401 Unauthorized
  }

  // O cabeçalho vem no formato "Bearer token", então separamos o token
  const [, token] = authHeader.split(' ');

  try {
    // Verifica e decodifica o token
    const decodedToken = verify(token, authConfig.jwt.secret);

    // O payload do seu token é { id: user._id }
    // Asseguramos que 'decodedToken' é um objeto e tem a propriedade 'id'
    if (typeof decodedToken === 'object' && 'id' in decodedToken) {
      req.user = {
        id: decodedToken.id,
      };
    } else {
      throw new AppError('Invalid JWT Token structure.', 401);
    }

    return next(); // Se tudo estiver certo, permite que a requisição continue
  } catch (err) {
    throw new AppError('Invalid JWT Token.', 401); // Token inválido ou expirado
  }
}
