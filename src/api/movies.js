import { authHeader, requestJson } from "./client";

export const searchMovies = ({ title, year, page }) => {
  const params = new URLSearchParams();
  if (title) {
    params.set("title", title);
  }
  if (year) {
    params.set("year", year);
  }
  params.set("page", page);

  return requestJson(`/movies/search?${params.toString()}`);
};

export const getMovieDetails = (imdbID) =>
  requestJson(`/movies/data/${encodeURIComponent(imdbID)}`);

export const getPersonDetails = (id, token) =>
  requestJson(`/people/${encodeURIComponent(id)}`, {
    headers: authHeader(token),
  });
