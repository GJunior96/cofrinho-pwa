// src/modules/recurringExpenses/schemas/RecurringExpenseSchema.js
import Joi from 'joi';
import { paginationSchema, dateFilterSchema } from '../../../shared/schemas/commonSchemas.js'

// Schema para criação de uma nova despesa recorrente
export const createRecurringExpenseSchema = Joi.object({
  description: Joi.string().required().min(3).max(255),
  amount: Joi.number().positive().required(),
  category: Joi.string().required().max(100),
  frequency: Joi.string().valid('daily', 'weekly', 'monthly', 'quarterly', 'yearly').required(),
  // A lógica do `dueDate` agora é mais complexa, usando `when`
  dueDate: Joi.alternatives().conditional('frequency', {
    is: 'monthly',
    then: Joi.number().integer().min(1).max(31).required(),
    otherwise: Joi.alternatives().conditional('frequency', {
      is: 'weekly',
      then: Joi.number().integer().min(0).max(6).required(), // 0 = Domingo, 1 = Segunda, etc.
      otherwise: Joi.alternatives().conditional('frequency', {
        is: 'yearly',
        then: Joi.string().pattern(/^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(), // Formato "MM-DD"
        otherwise: Joi.forbidden()
      })
    })
  }),

  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
  accountId: Joi.string().required(),
});

// Schema para atualização de despesa recorrente
export const updateRecurringExpenseSchema = Joi.object({
  description: Joi.string().min(3).max(255),
  amount: Joi.number().positive(),
  category: Joi.string().max(100),
  frequency: Joi.string().valid('daily', 'weekly', 'monthly', 'quarterly', 'yearly'),
  dueDate: Joi.alternatives().conditional('frequency', {
    is: 'monthly',
    then: Joi.number().integer().min(1).max(31).required(),
    otherwise: Joi.alternatives().conditional('frequency', {
      is: 'weekly',
      then: Joi.number().integer().min(0).max(6).required(), // 0 = Domingo, 1 = Segunda, etc.
      otherwise: Joi.alternatives().conditional('frequency', {
        is: 'yearly',
        then: Joi.string().pattern(/^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(), // Formato "MM-DD"
        otherwise: Joi.forbidden()
      })
    })
  }),
  startDate: Joi.date().iso().less('now'),
  endDate: Joi.date().iso().min(Joi.ref('startDate')),
  accountId: Joi.string(),
  isActive: Joi.boolean(),
}).min(1);

// Schema de validação para rota de listagem de despesas recorrentes
export const listRecurringExpensesSchema = Joi.object({
	isActive: Joi.boolean(),
	category: Joi.string().max(100),
	frequency: Joi.string().valid('daily', 'weekly', 'monthly', 'quarterly', 'yearly'),
}).concat(paginationSchema);