const jwt = require('jsonwebtoken');
const { JWT_SK } = require('../config/jwt');

const makeError = function (res, status, msg) {
  res.status(status).json({
    'error': status >= 400,
    'message': msg
  });
};

const signToken = function (email, exp) {
  return jwt.sign({
    email: email,
    exp: Math.floor(Date.now() / 1000) + exp
  }, JWT_SK);
};

const decodeToken = function (token) {
  try {
    return jwt.verify(token, JWT_SK);
  } catch (err) {
    if (err.message === 'jwt expired') {
      return 'JWT token has expired';
    } else {
      return 'Invalid JWT token';
    }
  }
};

const getToken = function (req) {
  let token = req.header('Authorization');
  if (!token) {
    return 'Authorization header (\'Bearer token\') not found';
  } else if (!token.startsWith('Bearer ')) {
    // return 'Authorization header is malformed';
    return 'Authorization header (\'Bearer token\') not found';
  } else {
    return decodeToken(token.replace('Bearer ', ''));
  }
};

module.exports = {
  makeError,
  signToken,
  decodeToken,
  getToken
};