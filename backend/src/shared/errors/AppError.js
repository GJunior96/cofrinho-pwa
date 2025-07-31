// src/shared/errors/AppError.js
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Indica que é um erro de operação (esperado)

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
