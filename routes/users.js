const express = require('express');
const { makeError, signToken, decodeToken, asyncHandler } = require('../helpers');
const { findUserByEmail, register, findUserByEmailAndPassword, updateUser } = require('../db/user');
const { mayLogin, mustLogin } = require('../middlewares');
const router = express.Router();
const oneDay = 60 * 60 * 24;
const oneYear = oneDay * 365;
const profileFields = ['firstName', 'lastName', 'dob', 'address'];

const createTokenResponse = function (email, bearerExpiresInSeconds, refreshExpiresInSeconds) {
  return {
    bearerToken: {
      token: signToken(email, bearerExpiresInSeconds),
      token_type: 'Bearer',
      expires_in: bearerExpiresInSeconds
    },
    refreshToken: {
      token: signToken(email, refreshExpiresInSeconds),
      token_type: 'Refresh',
      expires_in: refreshExpiresInSeconds
    }
  };
};

const validateProfileBody = function (body) {
  for (let k of profileFields) {
    if (!body[k]) {
      return 'Request body incomplete: firstName, lastName, dob and address are required.';
    }
    if (typeof body[k] !== 'string') {
      return 'Request body invalid: firstName, lastName and address must be strings only.';
    }
    if (k === 'dob') {
      const d = new Date(body[k]);
      if (d.getTime() > Date.now()) {
        return 'Invalid input: dob must be a date in the past.';
      }
      if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(body[k]) ||
        isNaN(d.getTime()) ||
        d.toISOString().split('T')[0] !== body[k]) {
        return 'Invalid input: dob must be a real date in format YYYY-MM-DD.';
      }
    }
  }
  return null;
};

router.post('/register', asyncHandler(async function (req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    makeError(res, 400, 'Request body incomplete, both email and password are required');
  } else if (await findUserByEmail(email)) {
    makeError(res, 409, 'User already exists');
  } else {
    await register(email, password);
    makeError(res, 201, 'User created');
  }
}));

router.post('/login', asyncHandler(async function (req, res, next) {
  const { email, password, longExpiry, bearerExpiresInSeconds, refreshExpiresInSeconds } = req.body;
  if (!email || !password) {
    return makeError(res, 400, 'Request body incomplete, both email and password are required');
  }
  const user = await findUserByEmailAndPassword(email, password);
  if (!user) {
    makeError(res, 401, 'Incorrect email or password');
  } else if (longExpiry) {
    res.json(createTokenResponse(user.email, oneYear, oneYear));
  } else {
    res.json(createTokenResponse(
      user.email,
      bearerExpiresInSeconds || 600,
      refreshExpiresInSeconds ?? oneDay
    ));
  }
}));

router.post('/refresh', asyncHandler(async function (req, res) {
  if (!req.body.refreshToken) {
    return makeError(res, 400, 'Request body incomplete, refresh token required');
  }
  let token = decodeToken(req.body.refreshToken);
  if (typeof token === 'string') {
    return makeError(res, 401, token);
  }
  res.json(createTokenResponse(token.email, 600, oneDay));
}));

router.post('/logout', asyncHandler(async function (req, res) {
  if (!req.body.refreshToken) {
    return makeError(res, 400, 'Request body incomplete, refresh token required');
  }
  let t = decodeToken(req.body.refreshToken);
  if (typeof t === 'string') {
    return makeError(res, 401, t);
  }
  makeError(res, 200, 'Token successfully invalidated');
}));

router.get('/:email/profile', mayLogin, asyncHandler(async function (req, res) {
  const email = req.params.email;
  if (!email) {
    return makeError(res, 400, 'You must supply an email!');
  }
  const user = await findUserByEmail(email);
  if (!user) {
    return makeError(res, 404, 'User not found!');
  }
  const result = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    dob: user.dob,
    address: user.address,
  };
  if (req.email !== email) {
    delete result['dob'];
    delete result['address'];
  }
  res.json(result);
}));

router.put('/:email/profile', mustLogin, asyncHandler(async function (req, res) {
  const email = req.params.email;
  if (!email) {
    return makeError(res, 400, 'You must supply an email!');
  }
  const profileError = validateProfileBody(req.body);
  if (profileError) {
    return makeError(res, 400, profileError);
  }
  if (email !== req.email) {
    return makeError(res, 403, 'Forbidden');
  }
  if (!await findUserByEmail(email)) {
    return makeError(res, 404, 'User not found!');
  }
  const toUpdate = {
    email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dob: req.body.dob,
    address: req.body.address,
  };
  await updateUser(toUpdate);
  res.json(toUpdate);
}));

module.exports = router;
