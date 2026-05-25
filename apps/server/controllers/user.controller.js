const {
  loginDeveloper,
  registerDeveloper,
} = require('../services/user.service');
const {
  validateLoginPayload,
  validateRegisterPayload,
} = require('../validators/user.validator');
const { env } = require('../config/env');

const cookieOptions = {
  httpOnly: true,
  sameSite: 'none',
  secure: env.nodeEnv === 'production',
};

const sendAuthResponse = (res, statusCode, data) => {
  res.cookie('token', data.token, cookieOptions);
  res.status(statusCode).json({
    success: true,
    data,
  });
};

const register = async (req, res) => {
  validateRegisterPayload(req.body);
  const data = await registerDeveloper(req.body);
  sendAuthResponse(res, 201, data);
};

const login = async (req, res) => {
  validateLoginPayload(req.body);
  const data = await loginDeveloper(req.body);
  sendAuthResponse(res, 200, data);
};

const me = (req, res) => {
  res.status(200).json({
    success: true,
    data: req.developer.toSafeObject(),
  });
};

const logout = (_req, res) => {
  res.clearCookie('token', cookieOptions);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

module.exports = { register, login, me, logout };
