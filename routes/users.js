const express = require('express');
const { makeError, signToken, decodeToken } = require('../helpers');
const { findUserByEmail, register, findUserByEmailAndPassword, updateUser } = require('../db/user');
const { mayLogin, mustLogin } = require('../middlewares');
const router = express.Router();

router.post('/register', async function (req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    makeError(res, 400, 'Request body incomplete, both email and password are required');
  } else if (await findUserByEmail(email)) {
    makeError(res, 409, 'User already exists');
  } else {
    await register(email, password);
    makeError(res, 201, 'User created');
  }
});

router.post('/login', async function (req, res, next) {
  const { email, password, longExpiry, bearerExpiresInSeconds, refreshExpiresInSeconds } = req.body;
  if (!email || !password) {
    return makeError(res, 400, 'Request body incomplete, both email and password are required');
  }
  const user = await findUserByEmailAndPassword(email, password);
  if (!user) {
    makeError(res, 401, 'Incorrect email or password');
  } else {
    if (longExpiry) {
      res.json({
        bearerToken: {
          token: signToken(user.email, 60 * 60 * 24 * 365),
          token_type: 'Bearer',
          expires_in: 60 * 60 * 24 * 365
        },
        refreshToken: {
          token: signToken(user.email, 60 * 60 * 24 * 365),
          token_type: 'Refresh',
          expires_in: 60 * 60 * 24 * 365
        }
      });
    } else {
      res.json({
        bearerToken: {
          token: signToken(user.email, bearerExpiresInSeconds || 600),
          token_type: 'Bearer',
          expires_in: bearerExpiresInSeconds || 600
        },
        refreshToken: {
          token: signToken(user.email, refreshExpiresInSeconds ?? 60 * 60 * 24),
          token_type: 'Refresh',
          expires_in: refreshExpiresInSeconds ?? 60 * 60 * 24
        }
      });
    }
  }
});

router.post('/refresh', async function (req, res) {
  if (!req.body.refreshToken) {
    return makeError(res, 400, 'Request body incomplete, refresh token required');
  }
  let token = decodeToken(req.body.refreshToken);
  if (typeof token === 'string') {
    return makeError(res, 401, token);
  }
  res.json({
    bearerToken: {
      token: signToken(token.email, 600),
      token_type: 'Bearer',
      expires_in: 600
    },
    refreshToken: {
      token: signToken(token.email, 60 * 60 * 24),
      token_type: 'Refresh',
      expires_in: 60 * 60 * 24
    }
  });
});

router.post('/logout', async function (req, res) {
  if (!req.body.refreshToken) {
    return makeError(res, 400, 'Request body incomplete, refresh token required');
  }
  let t = decodeToken(req.body.refreshToken);
  if (typeof t === 'string') {
    return makeError(res, 401, t);
  }
  makeError(res, 200, 'Token successfully invalidated');
});

router.get('/:email/profile', mayLogin, async function (req, res) {
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
});

router.put('/:email/profile', mustLogin, async function (req, res) {
  const email = req.params.email;
  if (!email) {
    return makeError(res, 400, 'You must supply an email!');
  }
  const params = ['firstName', 'lastName', 'dob', 'address'];
  for (let k of params) {
    if (!req.body[k]) {
      return makeError(res, 400, 'Request body incomplete: firstName, lastName, dob and address are required.');
    }
    if (typeof req.body[k] !== 'string') {
      return makeError(res, 400, 'Request body invalid: firstName, lastName and address must be strings only.');
    }
    if (k === 'dob') {
      const d = new Date(req.body[k]);
      if (d.getTime() > Date.now()) {
        return makeError(res, 400, 'Invalid input: dob must be a date in the past.');
      } else if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(req.body[k])) {
        return makeError(res, 400, 'Invalid input: dob must be a real date in format YYYY-MM-DD.');
      } else if (isNaN(d.getTime())) {
        return makeError(res, 400, 'Invalid input: dob must be a real date in format YYYY-MM-DD.');
      } else if (d.toISOString().split('T')[0] !== req.body[k]) {
        return makeError(res, 400, 'Invalid input: dob must be a real date in format YYYY-MM-DD.');
      }
    }
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
});

module.exports = router;
