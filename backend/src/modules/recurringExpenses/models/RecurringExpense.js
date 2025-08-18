// src/modules/recurringExpenses/models/RecurringExpense.js
import mongoose from 'mongoose';

const RecurringExpenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  amount: { // Valor da despesa fixa
    type: Number,
    required: true,
  },
  category: { // Categoria da despesa (ex: "Moradia", "Contas")
    type: String,
    required: true,
  },
  frequency: { // Frequência da recorrência (ex: 'monthly', 'weekly', 'yearly')
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
    default: 'monthly',
  },
  dueDate: { type: mongoose.Schema.Types.Mixed },
  startDate: { // Data de início da recorrência
    type: Date,
    default: Date.now,
  },
  endDate: { // Data de fim da recorrência (opcional, para despesas com término)
    type: Date,
    required: false,
  },
  account: { // A qual conta esta despesa recorrente está vinculada
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  user: { // O usuário que registrou essa despesa recorrente
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: { // Para ativar/desativar uma despesa recorrente sem deletá-la
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Atualiza 'updatedAt' sempre que o documento é salvo
RecurringExpenseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const RecurringExpense = mongoose.model('RecurringExpense', RecurringExpenseSchema);

export default RecurringExpense;
