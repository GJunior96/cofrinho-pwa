/*

// src/modules/auth/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import AppError from '../../../shared/errors/AppError.js';
import UserRepository from '../../users/repositories/UserRepository.js';

export const authMiddleware = async (req, res, next) => {

  // 1. Obter o token do cabeçalho
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError('Você não está logado! Por favor, faça o login para ter acesso.', 401));
  }
  const token = authHeader.replace(/^Bearer\s/, '').trim();
  
//  const [, token] = authHeader.split(' ');
//  const cleanedToken = token.trim();
  console.log("token com regex", token);
//  console.log("token com trim", cleanedToken);
console.log("Token length:", token ? token.length : "undefined");
//console.log("cleaned token length:", cleanedToken ? cleanedToken.length : "undefined");
  // 2. Verificar o token
  
  console.log("JWT Secret para verificação:", JSON.stringify(process.env.JWT_SECRET));
  try {
   // const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
    const decoded = await promisify(jwt.verify)(token, "5ec609c6c03e7f72f49ecf6ac17d3371");
    
    
    
    
    // 3. Checar se o usuário ainda existe
    const user = await UserRepository.findOne({ _id: decoded.id });
    if (!user) {
      return next(new AppError('O usuário deste token não existe mais.', 401));
    }

    // 4. Se tudo estiver ok, adicionar o usuário à requisição e seguir
    req.user = user;
    next();
  } catch (err) {
    console.log("erro na verificaçao do token:", err);
    return next(new AppError('Token inválido ou expirado. Faça o login novamente.', 401));
  }
};*/
/*
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import AppError from '../../../shared/errors/AppError.js';
import UserRepository from '../../users/repositories/UserRepository.js';

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError('Você não está logado! Por favor, faça o login para ter acesso.', 401));
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  console.log("Token recebido:", token);
  console.log("Token length:", token.length);

  // 🔍 Comparar com o último token gerado (se existir)
  if (global.__lastGeneratedToken) {
    const original = global.__lastGeneratedToken;
    if (original !== token) {
      console.log("⚠️ Token recebido é diferente do gerado no login!");

      // Mostrar diferenças caractere por caractere
      const maxLen = Math.max(original.length, token.length);
      for (let i = 0; i < maxLen; i++) {
        const oChar = original[i] || "(vazio)";
        const tChar = token[i] || "(vazio)";
        if (oChar !== tChar) {
          console.log(
            `Posição ${i}: esperado "${oChar}" (code: ${oChar.charCodeAt?.(0) || "-"}), ` +
            `recebido "${tChar}" (code: ${tChar.charCodeAt?.(0) || "-"})`
          );
        }
      }
    } else {
      console.log("✅ Token recebido bate exatamente com o gerado no login.");
    }
  } else {
    console.log("ℹ️ Nenhum token gerado anteriormente para comparar.");
  }

  try {
    const secret = "5ec609c6c03e7f72f49ecf6ac17d3371";
    const decoded = await promisify(jwt.verify)(token, secret);

    const user = await UserRepository.findOne({ _id: decoded.id });
    if (!user) {
      return next(new AppError('O usuário deste token não existe mais.', 401));
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Erro na verificação do token:", err.message);
    return next(new AppError('Token inválido ou expirado. Faça o login novamente.', 401));
  }
};*/

// src/modules/auth/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import AppError from '../../../shared/errors/AppError.js';
import UserRepository from '../../users/repositories/UserRepository.js';
import authConfig from '../../../config/auth.js'

//const JWT_SECRET = process.env.JWT_SECRET;
const DEBUG = true; // Coloque false em produção para não logar tokens

export const authMiddleware = async (req, res, next) => {
  const JWT_SECRET = authConfig.jwt.secret;
  
  try {
    // 1. Obter o cabeçalho Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AppError('Você não está logado! Por favor, faça o login para ter acesso.', 401);
    }

    // 2. Extrair o token com regex segura
    // Aceita "Bearer token", "bearer token", com múltiplos espaços
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!match || !match[1]) {
      throw new AppError('Formato do token inválido. Use: Bearer <token>', 401);
    }

    const token = match[1].trim();

    // Debug opcional
    if (DEBUG) {
      console.log("🔑 Token recebido:", token);
      console.log("📏 Tamanho:", token.length);
    }

    // 3. Verificar o token (transformado em Promise)
    const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

    // 4. Buscar usuário do token
    const user = await UserRepository.findOne({ _id: decoded.id });
    if (!user) {
      throw new AppError('O usuário deste token não existe mais.', 401);
    }

    // 5. Anexar usuário à requisição e seguir
    req.user = user;
    next();

  } catch (err) {
    if (DEBUG) {
      console.error("❌ Erro na verificação do token:", err.message);
    }

    // Tipos de erros tratados
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Seu token expirou. Faça login novamente.', 401));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new AppError('Token inválido. Faça login novamente.', 401));
    }

    return next(new AppError('Falha na autenticação.', 401));
  }
};
