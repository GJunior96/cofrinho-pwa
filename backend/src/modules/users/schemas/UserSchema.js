// src/modules/users/schemas/UserSchema.js
import Joi from 'joi';

// Schema para criação de um novo usuário
export const createUserSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  email: Joi.string().email().required().max(255),
  password: Joi.string().required().min(6).max(50),
});

// Schema para autenticação de usuário (login)
export const authenticateUserSchema = Joi.object({
  email: Joi.string().email().required().max(255),
  password: Joi.string().required().min(6).max(50),
});

// Schema para atualização de usuário (opcional, pois nem todos os campos são obrigatórios na atualização)
export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  email: Joi.string().email().max(255),
  password: Joi.string().min(6).max(50),
}).min(1); // Garante que pelo menos um campo seja fornecido para atualização
