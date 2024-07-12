const { getToken, makeError } = require('../helpers');

function mustLogin (req, res, next) {
  const token = getToken(req);
  if (typeof token === 'string') {
    makeError(res, 401, token);
  } else {
    req.email = token.email;
    next();
  }
}

function mayLogin (req, res, next) {
  const token = getToken(req);
  if (typeof token === 'string') {
    next();
  } else {
    req.email = token.email;
    next();
  }
}

module.exports = {
  mustLogin,
  mayLogin
};