// src/modules/users/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Importa o bcryptjs

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Não retorna a senha por padrão nas buscas
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware do Mongoose para hash da senha antes de salvar
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Método para comparar senhas (instância)
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;

