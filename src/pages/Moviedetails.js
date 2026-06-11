import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import "./Moviedetails.css";
import { getMovieDetails } from "../api/movies";

const groupedPeople = (people) => (
  people.reduce((groups, person) => {
    const group = groups[person.category] || [];
    groups[person.category] = [...group, person];
    return groups;
  }, {})
);

const MovieDetails = ({ match }) => {
  const imdbID = match.params.imdbID;
  const { user } = useContext(AuthContext);
  const [movieData, setMovieData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = Boolean(user);

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

  const peopleByRole = useMemo(() => (
    groupedPeople(movieData?.people || [])
  ), [movieData]);

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
    actors = [],
    awards,
    detailRows = [],
    genres = [],
    plot,
    poster,
    rated,
    ratings = [],
    released,
    runtime,
    title,
    type,
    year,
  } = movieData;

  return (
    <div className="movie-details-container">
      <section className="movie-hero">
        <div className="movie-poster-frame">
          {poster ? (
            <img src={poster} alt={title} className="poster" />
          ) : (
            <div className="poster-fallback">No poster</div>
          )}
        </div>
        <div className="movie-hero-copy">
          <p className="movie-kicker">{type || "Movie"}</p>
          <h1>{title}</h1>
          <div className="movie-chips">
            {[year, rated, runtime, released, ...genres].filter(Boolean).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <p className="movie-preview">
            {isLoggedIn && actors.length
              ? `Featuring ${actors.join(", ")}.`
              : "Log in to reveal cast, ratings, box office, awards, and complete movie details."}
          </p>
        </div>
      </section>

      {!isLoggedIn && (
        <div className="member-callout">
          <strong>Full details are locked.</strong>
          <span>Log in to reveal plot, ratings, box office, awards, and all people data returned by OMDb.</span>
        </div>
      )}

      <section className="member-details-shell">
        <div className={`member-details ${isLoggedIn ? "" : "member-details-blurred"}`}>
          <div className="detail-card detail-card-wide">
            <p className="detail-label">Full Plot</p>
            <p className="plot-text">{plot || "No plot available."}</p>
          </div>

          <div className="detail-grid">
            {detailRows.map((item) => (
              <div className="detail-card" key={item.label}>
                <p className="detail-label">{item.label}</p>
                <p className="detail-value">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="detail-columns">
            <div className="detail-card">
              <p className="detail-label">Ratings</p>
              {ratings.length ? (
                <ul className="ratings-list">
                  {ratings.map((rating) => (
                    <li key={rating.source}>
                      <span>{rating.source}</span>
                      <strong>{rating.value}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="detail-value">No ratings found.</p>
              )}
            </div>

            <div className="detail-card">
              <p className="detail-label">Awards</p>
              <p className="detail-value">{awards || "No awards data found."}</p>
            </div>
          </div>

          <div className="detail-card detail-card-wide">
            <p className="detail-label">People</p>
            {Object.keys(peopleByRole).length ? (
              <div className="people-groups">
                {Object.entries(peopleByRole).map(([role, people]) => (
                  <div className="people-group" key={role}>
                    <h2>{role}</h2>
                    <div className="people-list">
                      {people.map((person) => (
                        <span key={`${person.category}-${person.name}`}>{person.name}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="detail-value">No people data found.</p>
            )}
          </div>
        </div>

        {!isLoggedIn && (
          <div className="member-lock-overlay">
            <h2>Log in to view full movie details</h2>
            <Link to="/login">Login</Link>
          </div>
        )}
      </section>

      <div className="home-footer">
        <p>Movie data is provided by OMDb.</p>
        <p>(c) 2023 Yan Xiong</p>
      </div>
    </div>
  );
};

export default MovieDetails;
