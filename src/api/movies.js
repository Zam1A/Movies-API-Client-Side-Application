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

const textFilterValue = (filter) => (
  filter?.filter || filter?.values?.[0] || ""
);

const normalizedText = (value) => String(value || "").toLowerCase();

const matchesTextFilter = (value, filter) => {
  if (!filter) {
    return true;
  }

  const haystack = normalizedText(value);
  const needle = normalizedText(textFilterValue(filter));

  if (!needle) {
    return true;
  }

  if (filter.type === "equals") {
    return haystack === needle;
  }
  if (filter.type === "startsWith") {
    return haystack.startsWith(needle);
  }
  if (filter.type === "endsWith") {
    return haystack.endsWith(needle);
  }
  if (filter.type === "notContains") {
    return !haystack.includes(needle);
  }

  return haystack.includes(needle);
};

const matchesFilters = (movie, filterModel = {}) => (
  matchesTextFilter(movie.title, filterModel.title)
  && matchesTextFilter(movie.year, filterModel.year)
  && matchesTextFilter(movie.classification, filterModel.classification)
);

const compareValues = (field, direction) => (first, second) => {
  const multiplier = direction === "desc" ? -1 : 1;

  if (field === "year") {
    const firstYear = Number.parseInt(first.year, 10) || 0;
    const secondYear = Number.parseInt(second.year, 10) || 0;
    return (firstYear - secondYear) * multiplier;
  }

  return normalizedText(first[field]).localeCompare(normalizedText(second[field])) * multiplier;
};

const applySort = (movies, sortModel = []) => {
  const sort = sortModel.find((item) => ["title", "year", "classification"].includes(item.colId));

  if (!sort) {
    return movies;
  }

  return [...movies].sort(compareValues(sort.colId, sort.sort));
};

const apiTypeFromFilter = (filter) => {
  const type = normalizedText(textFilterValue(filter));
  return ["movie", "series", "episode"].includes(type) ? type : undefined;
};

const toPerson = (category) => (name) => ({
  id: encodeURIComponent(name),
  name,
  category,
});

const detailValue = (label, value) => ({
  label,
  value: normalizeValue(value),
});

const toMovieDetails = (movie) => {
  const actors = splitList(movie.Actors);
  const directors = splitList(movie.Director);
  const writers = splitList(movie.Writer);
  const ratings = Array.isArray(movie.Ratings)
    ? movie.Ratings.map((rating) => ({
      source: rating.Source,
      value: rating.Value,
    }))
    : [];

  return {
    actors,
    awards: normalizeValue(movie.Awards),
    boxoffice: normalizeValue(movie.BoxOffice),
    country: normalizeValue(movie.Country),
    detailRows: [
      detailValue("Rated", movie.Rated),
      detailValue("Released", movie.Released),
      detailValue("Runtime", movie.Runtime),
      detailValue("Language", movie.Language),
      detailValue("Country", movie.Country),
      detailValue("Awards", movie.Awards),
      detailValue("Box Office", movie.BoxOffice),
      detailValue("Metascore", movie.Metascore),
      detailValue("IMDb Rating", movie.imdbRating),
      detailValue("IMDb Votes", movie.imdbVotes),
      detailValue("Type", movie.Type),
      detailValue("DVD", movie.DVD),
      detailValue("Production", movie.Production),
      detailValue("Website", movie.Website),
      detailValue("IMDb ID", movie.imdbID),
    ].filter((item) => item.value),
    directors,
    dvd: normalizeValue(movie.DVD),
    genres: splitList(movie.Genre),
    imdbID: movie.imdbID,
    imdbRating: parseRating(movie.imdbRating),
    imdbVotes: normalizeValue(movie.imdbVotes),
    language: normalizeValue(movie.Language),
    metacriticRating: parseRating(movie.Metascore),
    metascore: normalizeValue(movie.Metascore),
    people: [
      ...directors.map(toPerson("Director")),
      ...writers.map(toPerson("Writer")),
      ...actors.map(toPerson("Actor")),
    ],
    plot: normalizeValue(movie.Plot),
    poster: normalizeValue(movie.Poster),
    principals: actors.map(toPerson("Actor")),
    production: normalizeValue(movie.Production),
    rated: normalizeValue(movie.Rated),
    ratings,
    released: normalizeValue(movie.Released),
    rottenTomatoesRating: parseRating(
      ratings.find((rating) => rating.source === "Rotten Tomatoes")?.value
    ),
    runtime: normalizeValue(movie.Runtime),
    title: movie.Title,
    type: normalizeValue(movie.Type),
    website: normalizeValue(movie.Website),
    writers,
    year: movie.Year,
  };
};

export const searchMovies = async ({
  filterModel = {},
  page,
  sortModel = [],
  title,
  year,
}) => {
  const titleQuery = textFilterValue(filterModel.title) || title || "movie";
  const yearQuery = textFilterValue(filterModel.year) || year;
  const typeQuery = apiTypeFromFilter(filterModel.classification);

  const data = await requestOmdb({
    s: titleQuery,
    y: yearQuery || undefined,
    type: typeQuery,
    page: Math.min(Math.max(Number(page) || 1, 1), 100),
  });

  if (data.error) {
    return data;
  }

  const rows = Array.isArray(data.Search) ? data.Search.map(toMovieRow) : [];
  const filteredRows = rows.filter((movie) => matchesFilters(movie, filterModel));

  return {
    data: applySort(filteredRows, sortModel),
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
