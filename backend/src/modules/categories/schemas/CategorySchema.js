// src/modules/categories/schemas/category.schema.js
import Joi from 'joi';

// Schema para a criação de uma categoria
export const createCategorySchema = Joi.object({
  name: Joi.string().min(1).max(50).required().messages({
    'string.empty': 'O nome da categoria é obrigatório.',
    'string.min': 'O nome deve ter no mínimo 1 caractere.',
    'string.max': 'O nome deve ter no máximo 50 caracteres.',
    'any.required': 'O nome da categoria é obrigatório.',
  }),
  color: Joi.string().optional(),
});

// Schema para a atualização de uma categoria
export const updateCategorySchema = Joi.object({
  name: Joi.string().min(1).max(50).optional().messages({
    'string.min': 'O nome deve ter no mínimo 1 caractere.',
    'string.max': 'O nome deve ter no máximo 50 caracteres.',
  }),
  color: Joi.string().optional(),
});
