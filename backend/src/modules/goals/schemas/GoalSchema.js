// src/modules/goals/schemas/GoalSchema.js
import Joi from 'joi';
import { paginationSchema } from '../../../shared/schemas/commonSchemas.js';

// Schema para criação de uma nova meta
export const createGoalSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  targetAmount: Joi.number().positive().required(),
  deadline: Joi.date().iso().min('now').optional(), // Data limite no formato ISO, opcional, mas não pode ser no passado
  description: Joi.string().max(500).optional().allow(''), // Descrição opcional, pode ser vazia
  accountId: Joi.string().optional(), // ID da conta vinculada, opcional
});

// Schema para atualização de meta
export const updateGoalSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  targetAmount: Joi.number().positive(),
  currentAmount: Joi.number().min(0), // Pode ser 0 ou positivo
  deadline: Joi.date().iso().min('now'),
  description: Joi.string().max(500).allow(''),
  accountId: Joi.string(),
  isAchieved: Joi.boolean(),
}).min(1);

// Schema para listar metas com paginação
export const listGoalsSchema = Joi.object({
	isAchieved: Joi.boolean(),
}).concat(paginationSchema);
