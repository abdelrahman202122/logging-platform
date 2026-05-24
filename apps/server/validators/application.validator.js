const { ApiError } = require("../utils/apiError");

const validateApplicationPayload = (payload = {}) => {
  const { name } = payload;

  if (!name) {
    throw new ApiError(400, "Application name is required");
  }

  if (/\s/.test(name)) {
    throw new ApiError(400, "Application name cannot contain whitespaces");
  }
};

module.exports = { validateApplicationPayload };
