// src/shared/middlewares/errorHandler.js
import AppError from '../errors/AppError.js';

const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Para erros de programação ou erros que não são AppError
  console.error('ERROR 💥', err); // Loga o erro completo no console para depuração
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};

export default errorHandler;
