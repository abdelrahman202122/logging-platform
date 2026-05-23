const { ApiError } = require("../utils/apiError");

const validateApplicationPayload = ({ name }) => {
  if (!name) {
    throw new ApiError(400, "Application name is required");
  }

  if (/\s/.test(name)) {
    throw new ApiError(400, "Application name cannot contain whitespaces");
  }
};

module.exports = { validateApplicationPayload };
