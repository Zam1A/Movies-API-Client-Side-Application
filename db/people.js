const db = require('./db');

async function getPeopleById (id) {
  let data = await db('names')
    .select('*')
    .where({
      'nconst': id
    })
    .first();
  if (!data) {
    return null;
  }
  let roles = await db('principals')
    .select('*')
    .where({
      'nconst': id
    })
    .join('basics', 'principals.tconst', 'basics.tconst');

  return {
    name: data.primaryName,
    birthYear: data.birthYear,
    deathYear: data.deathYear,
    roles: roles.map(r => {
      return {
        movieName: r.primaryTitle,
        movieId: r.tconst,
        category: r.category,
        characters: r.characters ? JSON.parse(r.characters) : [],
        imdbRating: r.imdbRating === null ? null :Number(r.imdbRating),
      };
    })
  };
}

module.exports = {
  getPeopleById
};
