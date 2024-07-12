const express = require('express');
const { searchMovies, getMovieDetail } = require('../db/movie');
const { makeError } = require('../helpers');
const router = express.Router();

router.get('/search', async function (req, res) {
  let { title, year, page } = req.query;
  if (!page) {
    page = 1;
  } else if (!/^[0-9]+$/.test(page)) {
    return makeError(res, 400, 'Invalid page format. page must be a number.');
  } else {
    page = parseInt(page);
  }
  if (!!year) {
    if (!/^[0-9]{4}$/.test(year)) {
      return makeError(res, 400, 'Invalid year format. Format must be yyyy.');
    }
  }
  res.json(await searchMovies(title, year, page));
});

router.get('/data/:id', async function (req, res) {
  if (Object.keys(req.query).length) {
    return makeError(res, 400, 'Query parameters are not permitted.');
  }
  const data = await getMovieDetail(req.params.id);
  if (!data) {
    return makeError(res, 404, 'No record exists of a movie with this ID');
  } else {
    res.json(data);
  }
});

module.exports = router;
