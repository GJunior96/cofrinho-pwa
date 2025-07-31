// src/config/auth.js
export default {
  jwt: {
    secret: process.env.JWT_SECRET || 'umsegredomuitosecreto', // Use uma variável de ambiente para a chave secreta!
    expiresIn: '1d', // Token expira em 1 dia
  },
};
