// src/modules/accounts/models/Account.js
import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['personal', 'joint'], // Tipos de conta: pessoal ou conjunta
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  owner: { // Para contas pessoais, o ID do proprietário
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() { return this.type === 'personal'; } // Obrigatório se for conta pessoal
  },
  members: [{ // Para contas conjuntas, os IDs dos membros
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() { return this.type === 'joint'; } // Obrigatório se for conta conjunta
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Account = mongoose.model('Account', AccountSchema);

export default Account;
