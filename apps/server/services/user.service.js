const {
  createDeveloper,
  findDeveloperByEmail,
  findDeveloperById,
} = require("../repositories/developer.repository");
const { ApiError } = require("../utils/apiError");
const { signAuthToken } = require("../utils/token");

const registerDeveloper = async (payload) => {
  const existingDeveloper = await findDeveloperByEmail(payload.email);
  if (existingDeveloper) {
    throw new ApiError(409, "Email is already registered");
  }

  const developer = await createDeveloper(payload);
  const developerWithApiKey = await findDeveloperById(developer._id, { includeApiKey: true });
  const token = signAuthToken(developer._id);

  return { developer: developerWithApiKey.toSafeObject(), token };
};

const loginDeveloper = async ({ email, password }) => {
  const developer = await findDeveloperByEmail(email, { includeSecrets: true });
  if (!developer) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await developer.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signAuthToken(developer._id);
  return { developer: developer.toSafeObject(), token };
};

const getAuthenticatedDeveloper = async (developerId) => {
  const developer = await findDeveloperById(developerId, { includeApiKey: true });
  if (!developer) {
    throw new ApiError(401, "Authentication failed");
  }

  return developer;
};

module.exports = {
  registerDeveloper,
  loginDeveloper,
  getAuthenticatedDeveloper,
};
