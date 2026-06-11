const db = require('./db');

const pageSize = 100;

const whereTitleLike = function (query, title) {
  query.andWhere('primaryTitle', 'like', `%${title}%`);
};

const applyMovieFilters = function (query, title, year) {
  if (title) {
    whereTitleLike(query, title);
  }
  if (year) {
    query.andWhere({ year: year });
  }
  return query;
};

const countMovies = async function (title, year, page) {
  const query = applyMovieFilters(db('basics'), title, year).count().first();
  const result = await query;
  const total = Number(result['count(*)'] || 0);
  const last = total > 0 ? Math.ceil(total / pageSize) : 0;
  return {
    total: total,
    perPage: pageSize,
    currentPage: page,
    from: (page - 1) * pageSize,
    to: page * pageSize,
    lastPage: last,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < last ? page + 1 : null
  };
};

const searchMovies = async function (title, year, page) {
  const query = applyMovieFilters(db('basics').select('*'), title, year)
    .offset((page - 1) * pageSize)
    .limit(pageSize);
  const result = await query;
  const pagination = await countMovies(title, year, page);
  pagination.to = (page - 1) * pageSize + result.length;
  return {
    data: result.map(r => {
      return {
        title: r.primaryTitle,
        year: r.year,
        imdbID: r.tconst,
        imdbRating: r.imdbRating === null ? null : Number(r.imdbRating),
        rottenTomatoesRating: r.rottentomatoesRating === null ? null : Number(r.rottentomatoesRating),
        metacriticRating: r.metacriticRating === null ? null : Number(r.metacriticRating),
        classification: r.rated
      };
    }),
    pagination: pagination
  };
};

async function getMovieDetail (id) {
  const result = await db('basics')
    .select('*')
    .where({
      'tconst': id
    })
    .first();
  if (!result) {
    return null;
  }
  const principals = await db('principals')
    .select('*')
    .where({
      'tconst': id
    });
  const ratings = await db('ratings')
    .select('*')
    .where({
      'tconst': id
    });

  return {
    title: result.primaryTitle,
    year: result.year,
    runtime: result.runtimeMinutes,
    genres: result.genres ? result.genres?.split(',') : [],
    country: result.country,
    boxoffice: result.boxoffice,
    poster: result.poster,
    plot: result.plot,
    principals: principals.map(r => {
      return {
        id: r.nconst,
        category: r.category,
        name: r.name,
        characters: r.characters ? JSON.parse(r.characters) : [],
      };
    }),
    ratings: ratings.map(r => {
      let value = r.value;
      if (/%/.test(value)) {
        value = value.replace(/%/, '');
      } else if (/\//.test(value)) {
        value = value.split('/')[0];
      }
      return {
        source: r.source,
        value: Number(value),
      };
    })
  };
}

module.exports = {
  searchMovies,
  countMovies,
  getMovieDetail
};
