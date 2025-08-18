// src/modules/transactions/schemas/TransactionSchema.js
import Joi from 'joi';
import { paginationSchema, dateFilterSchema } from '../../../shared/schemas/commonSchemas.js'

// Schema para criação de uma nova transação
export const createTransactionSchema = Joi.object({
  description: Joi.string().required().min(3).max(255),
  amount: Joi.number().positive().required(), // Montante deve ser um número positivo
  type: Joi.string().valid('income', 'expense').required(),
  date: Joi.date().iso().less('now').optional(), // Data no formato ISO (YYYY-MM-DD), opcional e não pode ser no futuro
  accountId: Joi.string().required(), // ID da conta vinculada (Mongoose ObjectId é uma string)
  category: Joi.string().max(100).optional(),
});

// Schema para atualização de transação
export const updateTransactionSchema = Joi.object({
  description: Joi.string().min(3).max(255),
  amount: Joi.number().positive(),
  type: Joi.string().valid('income', 'expense'),
  date: Joi.date().iso().less('now'),
  category: Joi.string().max(100),
}).min(1);

// Schema de validação para os parâmetro de filtro e paginação (query string)
export const filterTransactionsSchema = Joi.object({
	type: Joi.string().valid('income', 'expense'),
	category: Joi.string().max(100),
}).concat(paginationSchema).concat(dateFilterSchema);

