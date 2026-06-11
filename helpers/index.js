const jwt = require('jsonwebtoken');
const { JWT_SK } = require('../config/jwt');

const makeError = (res, status, msg) => res.status(status).json({
  error: status >= 400,
  message: msg
});

const signToken = (email, exp) => jwt.sign({
  email: email,
  exp: Math.floor(Date.now() / 1000) + exp
}, JWT_SK);

const decodeToken = function (token) {
  try {
    return jwt.verify(token, JWT_SK);
  } catch (err) {
    return err.message === 'jwt expired'
      ? 'JWT token has expired'
      : 'Invalid JWT token';
  }
};

const getToken = function (req) {
  const token = req.header('Authorization');
  if (!token || !token.startsWith('Bearer ')) {
    return 'Authorization header (\'Bearer token\') not found';
  }
  return decodeToken(token.replace('Bearer ', ''));
};

const asyncHandler = handler => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

module.exports = {
  makeError,
  signToken,
  decodeToken,
  getToken,
  asyncHandler
};
