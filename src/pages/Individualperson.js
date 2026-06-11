import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Chart from "chart.js/auto";
import { AuthContext } from "../AuthContext";
import "./Individualperson.css";
import { refreshToken } from "../api/auth";
import { getPersonDetails } from "../api/movies";

const perPage = 10;

const Individualperson = () => {
  const { id } = useParams();
  const { user, token, refresh, handleLogin } = useContext(AuthContext);
  const [personData, setPersonData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const fetchPerson = async () => {
      setIsLoading(true);
      setErrorMessage("");
      setPersonData(null);
      setCurrentPage(1);

      if (!user || !token) {
        setErrorMessage("Please log in to view person details.");
        setIsLoading(false);
        return;
      }

      let data = await getPersonDetails(id, token);

      if (data.status === 401 && refresh) {
        const refreshed = await refreshToken(refresh);
        if (!refreshed.error) {
          handleLogin(refreshed, user.email);
          data = await getPersonDetails(id, refreshed.bearerToken.token);
        } else {
          setErrorMessage("Please log in to view person details.");
          setIsLoading(false);
          return;
        }
      }

      if (data.error) {
        setErrorMessage(data.status === 404
          ? "The requested person could not be found."
          : data.message || "An error occurred while fetching data.");
      } else {
        setPersonData(data);
      }

      setIsLoading(false);
    };

    fetchPerson();
  }, [id, token, user, refresh, handleLogin]);

  useEffect(() => {
    if (!personData || !chartRef.current) {
      return undefined;
    }

    const ratingBuckets = personData.roles
      .map((role) => Number(role.imdbRating))
      .filter(Number.isFinite)
      .reduce((buckets, rating) => {
        const bucket = Math.floor(rating);
        buckets[bucket] = (buckets[bucket] || 0) + 1;
        return buckets;
      }, {});

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current.getContext("2d"), {
      type: "bar",
      data: {
        labels: Object.keys(ratingBuckets),
        datasets: [{
          label: "IMDb Ratings",
          data: Object.values(ratingBuckets),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
      },
    });

    return () => {
      chartInstance.current?.destroy();
      chartInstance.current = null;
    };
  }, [personData]);

  if (isLoading) {
    return <div className="center-text">Loading...</div>;
  }

  if (errorMessage) {
    return (
      <div className="center-container">
        <div className="center-content">
          <p className="center-text">{errorMessage}</p>
          {!user && (
            <div className="center-button">
              <Link to="/login">Log in</Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!personData) {
    return <div className="center-text">No data available.</div>;
  }

  const { name, birthYear, deathYear, roles = [] } = personData;
  const birthYearText = deathYear ? `${birthYear}-${deathYear}` : `${birthYear}-`;
  const indexOfLastRole = currentPage * perPage;
  const indexOfFirstRole = indexOfLastRole - perPage;
  const currentRoles = roles.slice(indexOfFirstRole, indexOfLastRole);
  const totalResults = roles.length;
  const totalPages = Math.ceil(totalResults / perPage);
  const showingResults = totalResults
    ? `${indexOfFirstRole + 1}-${Math.min(indexOfLastRole, totalResults)} of ${totalResults} results`
    : "0 results";

  return (
    <div className="page-container">
      <div className="center-content">
        <h1 className="center-text">{name}</h1>
        <p className="center-text">{birthYearText}</p>
        <h2 className="center-text">Movies</h2>
        <table className="center-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Movie</th>
              <th>Characters</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {currentRoles.map((role) => (
              <tr key={`${role.movieId}-${role.category}`}>
                <td>{role.category}</td>
                <td>
                  <Link to={`/moviedetails/${role.movieId}`}>{role.movieName}</Link>
                </td>
                <td>{(role.characters || []).join(", ")}</td>
                <td>{role.imdbRating ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <p className="showing-results">{showingResults}</p>
          <div className="pagination-buttons">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        <h2 className="center-text">IMDb Ratings Chart</h2>
        <canvas ref={chartRef} id="chart" width="400" height="200" />
      </div>
      <div className="home-footer">
        <p>All data is from IMDB, Metacritic and RottenTomatoes.</p>
        <p>(c) 2023 Yan Xiong</p>
      </div>
    </div>
  );
};

export default Individualperson;
