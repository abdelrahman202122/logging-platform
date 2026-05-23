const { env } = require('../config/env');
const { ApiError } = require('../utils/apiError');

const handleCastError = (error) =>
  new ApiError(400, `Invalid ${error.path}: ${error.value}`);

const handleDuplicateKeyError = (error) => {
  const fields = Object.keys(error.keyValue || {}).join(', ') || 'field';
  return new ApiError(409, `Duplicate value for: ${fields}`);
};

const handleValidationError = (error) => {
  const messages = Object.values(error.errors).map(
    (validationError) => validationError.message,
  );
  return new ApiError(400, messages.join('. '));
};

const handleJwtError = () => new ApiError(401, 'Invalid authentication token');

const handleJwtExpiredError = () =>
  new ApiError(401, 'Authentication token has expired');

const normalizeError = (error) => {
  if (error.name === 'CastError') {
    return handleCastError(error);
  }

  if (error.code === 11000) {
    return handleDuplicateKeyError(error);
  }

  if (error.name === 'ValidationError') {
    return handleValidationError(error);
  }

  if (error.name === 'JsonWebTokenError') {
    return handleJwtError();
  }

  if (error.name === 'TokenExpiredError') {
    return handleJwtExpiredError();
  }

  return error;
};

const sendDevelopmentError = (error, res) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    status: error.status || 'error',
    message: error.message,
    isOperational: Boolean(error.isOperational),
    error,
    stack: error.stack,
  });
};

const sendProductionError = (error, res) => {
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      status: error.status,
      message: error.message,
    });
  }

  console.error('Unexpected error:', error);

  return res.status(500).json({
    success: false,
    status: 'error',
    message: 'Something went wrong',
  });
};

const errorHandler = (error, _req, res, _next) => {
  const normalizedError = normalizeError(error);

  if (env.nodeEnv === 'production') {
    return sendProductionError(normalizedError, res);
  }

  return sendDevelopmentError(normalizedError, res);
};

module.exports = { errorHandler };
