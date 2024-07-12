const db = require('./db');

let pagesize = 100;

const countMovies = async function (title, year, page) {
  const query = db('basics');
  if (title) {
    query.andWhereILike('primaryTitle', `%${title}%`);
  }
  if (year) {
    query.andWhere({ year: year });
  }
  query.count().first();
  const result = await query;
  const total = result['count(*)'];
  const last = total > 0 ? Math.floor(total / 100) + 1 : 0
  return {
    total: total,
    perPage: pagesize,
    currentPage: page,
    from: (page - 1) * pagesize,
    to: page * pagesize,
    lastPage: last,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < last ? page + 1 : null
  };
};

const searchMovies = async function (title, year, page) {
  const query = db('basics').select('*');
  if (title) {
    query.andWhereILike('primaryTitle', `%${title}%`);
  }
  if (year) {
    query.andWhere({ year: year });
  }
  query.offset((page - 1) * pagesize).limit(pagesize);
  const result = await query;
  const pagination = await countMovies(title, year, page);
  pagination.to = (page - 1) * pagesize + result.length
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
