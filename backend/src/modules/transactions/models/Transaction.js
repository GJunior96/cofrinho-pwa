// src/modules/transactions/models/Transaction.js
import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  amount: { // Valor da transação
    type: Number,
    required: true,
  },
  type: { // Tipo de transação: 'income' (receita) ou 'expense' (despesa)
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  date: { // Data em que a transação ocorreu
    type: Date,
    default: Date.now,
  },
  account: { // A qual conta esta transação pertence
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  user: { // Qual usuário registrou a transação (útil para auditoria, mesmo em contas conjuntas)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: { // Categoria da transação (ex: "Alimentação", "Salário", "Transporte")
    type: String,
    required: false, // Opcional por enquanto, mas pode se tornar obrigatório
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

export default Transaction;
