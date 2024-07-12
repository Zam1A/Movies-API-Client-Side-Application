const express = require('express');
const { makeError } = require('../helpers');
const { getPeopleById } = require('../db/people');
const { mustLogin } = require('../middlewares');
const router = express.Router();

/* GET home page. */
router.get('/:id', mustLogin, async function (req, res, next) {
  if (Object.keys(req.query).length) {
    return makeError(res, 400, 'Query parameters are not permitted.');
  }
  const data = await getPeopleById(req.params.id);
  if (!data) {
    return makeError(res, 404, 'No record exists of a person with this ID');
  } else {
    res.json(data);
  }
});

module.exports = router;
