// src/modules/accounts/schemas/AccountSchema.js
import Joi from 'joi';

// Schema para criação de uma nova conta
export const createAccountSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  type: Joi.string().valid('personal', 'joint').required(),
  // memberEmails é opcional, e só é obrigatório se type for 'joint'
  memberEmails: Joi.array().items(Joi.string().email()).when('type', {
    is: 'joint',
    then: Joi.array().min(1).messages({
      'array.min': 'Para contas conjuntas, pelo menos um email de membro deve ser fornecido.'
    }),
    otherwise: Joi.array().max(0) // Não deve ter memberEmails para conta pessoal
  }),
});

// Schema para atualização de conta (ex: nome, ou talvez balance no futuro)
export const updateAccountSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  balance: Joi.number().min(0), // Exemplo: se permitir ajuste manual do balance
  // Outros campos que podem ser atualizados
}).min(1);
