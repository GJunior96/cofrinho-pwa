// src/shared/middlewares/validateRequest.js
import AppError from '../errors/AppError.js';

// Middleware genérico para validar body ou query
const validateRequest = (schema, source = 'body') => (req, res, next) => {
  const dataToValidate = req[source];
  const { error } = schema.validate(dataToValidate, { abortEarly: false, allowUnknown: true });

  if (error) {
    const errors = error.details.map(err => ({
      field: err.path.join('.'),
      message: err.message.replace(/\"/g, ''),
    }));
    throw new AppError('Validation Error', 400, errors);
  }

  next();
};

export default validateRequest;
