// src/shared/schemas/commonSchemas.js
import Joi from 'joi';

// Schema de validação para os parâmetros de paginação
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
});

// Schema de validação para filtros de data
export const dateFilterSchema = Joi.object({
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
});
