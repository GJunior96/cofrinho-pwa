// src/config/auth.js
export default {
  jwt: {
    get secret() {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET não definido!");
      }
      return process.env.JWT_SECRET;
    },
    expiresIn: '1d',
  },
};