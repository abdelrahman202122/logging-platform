const { ApiError } = require('../utils/apiError');

const validateRegisterPayload = ({ username, email, password }) => {
  if (!username || !email || !password) {
    throw new ApiError(400, 'Username, email, and password are required');
  }

  if (password.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters long');
  }
};

const validateLoginPayload = ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }
};

module.exports = { validateRegisterPayload, validateLoginPayload };
