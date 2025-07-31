// src/modules/goals/models/Goal.js
import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  targetAmount: { // Valor total que se deseja alcançar
    type: Number,
    required: true,
  },
  currentAmount: { // Valor atual acumulado para a meta
    type: Number,
    default: 0,
  },
  deadline: { // Data limite para alcançar a meta (opcional)
    type: Date,
    required: false,
  },
  description: { // Descrição detalhada da meta (opcional)
    type: String,
    required: false,
  },
  // A meta pode estar vinculada a uma conta específica, ou ser geral do usuário
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: false, // Pode ser uma meta não vinculada a uma conta específica
  },
  user: { // O usuário que criou/é responsável pela meta
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isAchieved: { // Indica se a meta foi alcançada
    type: Boolean,
    default: false,
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
GoalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Goal = mongoose.model('Goal', GoalSchema);

export default Goal;
