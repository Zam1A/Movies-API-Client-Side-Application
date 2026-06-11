import { requestOmdb } from "./client";

const normalizeValue = (value) => (
  value && value !== "N/A" ? value : null
);

const splitList = (value) => (
  normalizeValue(value) ? value.split(",").map((item) => item.trim()) : []
);

const parseRating = (value) => {
  if (!normalizeValue(value)) {
    return null;
  }

  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : null;
};

const toMovieRow = (movie) => ({
  imdbID: movie.imdbID,
  title: movie.Title,
  year: movie.Year,
  classification: movie.Type,
  poster: normalizeValue(movie.Poster),
});

const toPrincipal = (name) => ({
  id: encodeURIComponent(name),
  name,
  category: "Actor",
});

const toMovieDetails = (movie) => ({
  imdbID: movie.imdbID,
  title: movie.Title,
  year: movie.Year,
  runtime: normalizeValue(movie.Runtime),
  genres: splitList(movie.Genre),
  country: normalizeValue(movie.Country),
  plot: normalizeValue(movie.Plot),
  principals: splitList(movie.Actors).map(toPrincipal),
  ratings: Array.isArray(movie.Ratings)
    ? movie.Ratings.map((rating) => ({
      source: rating.Source,
      value: rating.Value,
    }))
    : [],
  boxoffice: normalizeValue(movie.BoxOffice),
  poster: normalizeValue(movie.Poster),
  imdbRating: parseRating(movie.imdbRating),
  rottenTomatoesRating: parseRating(
    movie.Ratings?.find((rating) => rating.Source === "Rotten Tomatoes")?.Value
  ),
  metacriticRating: parseRating(movie.Metascore),
});

export const searchMovies = async ({ title, year, page }) => {
  const data = await requestOmdb({
    s: title || "movie",
    y: year || undefined,
    type: "movie",
    page: Math.min(Math.max(Number(page) || 1, 1), 100),
  });

  if (data.error) {
    return data;
  }

  return {
    data: Array.isArray(data.Search) ? data.Search.map(toMovieRow) : [],
    pagination: {
      total: Math.min(Number(data.totalResults) || 0, 1000),
      page: Number(page) || 1,
      perPage: 10,
    },
  };
};

export const getMovieDetails = async (imdbID) => {
  const data = await requestOmdb({
    i: imdbID,
    plot: "full",
  });

  return data.error ? data : toMovieDetails(data);
};
