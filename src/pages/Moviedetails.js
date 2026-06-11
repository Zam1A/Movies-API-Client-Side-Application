import React, { useEffect, useState } from "react";
import "./Moviedetails.css";
import { Link } from "react-router-dom";
import { getMovieDetails } from "../api/movies";

const MovieDetails = ({ match }) => {
  const imdbID = match.params.imdbID;
  const [movieData, setMovieData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      setIsLoading(true);
      setErrorMessage("");

      const data = await getMovieDetails(imdbID);
      if (data.error) {
        setErrorMessage(data.message || "Movie details could not be loaded.");
        setMovieData(null);
      } else {
        setMovieData(data);
      }

      setIsLoading(false);
    };

    fetchMovieData();
  }, [imdbID]);

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) {
      return "N/A";
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return <div className="center-text">Loading...</div>;
  }

  if (errorMessage) {
    return <div className="center-text">{errorMessage}</div>;
  }

  if (!movieData) {
    return <div className="center-text">No movie data available.</div>;
  }

  const {
    title,
    year,
    runtime,
    genres = [],
    country,
    plot,
    principals = [],
    ratings = [],
    boxoffice,
    poster,
  } = movieData;

  return (
    <div className="movie-details-container">
      <div className="title-container">
        <h1>{title}</h1>
      </div>
      <div className="content-container">
        <div className="details-container">
          <p>Year: {year || "N/A"}</p>
          <p>Runtime: {runtime ? `${runtime} minutes` : "N/A"}</p>
          <p>Genres: {genres.length ? genres.join(", ") : "N/A"}</p>
          <p>Country: {country || "N/A"}</p>
          <p>Box Office: {formatCurrency(boxoffice)}</p>
          <p><em>{plot || "No plot available."}</em></p>
          <h2>Cast</h2>
          {principals.length > 0 ? (
            <table className="tableStyle">
              <thead>
                <tr>
                  <th className="center-text">Name</th>
                  <th className="center-text">Roles</th>
                  <th className="center-text">Characters</th>
                </tr>
              </thead>
              <tbody>
                {principals.map((principal) => (
                  <tr key={`${principal.id}-${principal.category}`}>
                    <td className="center-text">
                      <Link to={`/individualperson/${principal.id}`}>{principal.name}</Link>
                    </td>
                    <td className="center-text">{principal.category}</td>
                    <td className="center-text">{(principal.characters || []).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No principals found.</p>
          )}
        </div>
        <div className="poster-ratings-container">
          <div className="poster-container">
            {poster ? (
              <img src={poster} alt={title} className="poster" />
            ) : (
              <p>No poster available.</p>
            )}
          </div>
          <div className="ratings-container">
            <h2>Ratings</h2>
            {ratings.length > 0 ? (
              <ul>
                {ratings.map((rating) => (
                  <li key={rating.source}>
                    {rating.source}: {rating.value}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No ratings found.</p>
            )}
          </div>
        </div>
      </div>
      <div className="home-footer">
        <p>All data is from IMDB, Metacritic and RottenTomatoes.</p>
        <p>(c) 2023 Yan Xiong</p>
      </div>
    </div>
  );
};

export default MovieDetails;
