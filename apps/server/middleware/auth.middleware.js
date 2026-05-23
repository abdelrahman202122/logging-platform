const { getAuthenticatedDeveloper } = require('../services/user.service');
const { ApiError } = require('../utils/apiError');
const { verifyAuthToken } = require('../utils/token');

const getBearerToken = (authorizationHeader) => {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return null;
  }

  return authorizationHeader.split(' ')[1];
};

const protect = async (req, _res, next) => {
  const token = getBearerToken(req.headers.authorization) || req.cookies.token;

  if (!token) {
    throw new ApiError(401, 'Authentication token is required');
  }

  const decoded = verifyAuthToken(token);
  req.developer = await getAuthenticatedDeveloper(decoded.developerId);
  next();
};

module.exports = { protect };
