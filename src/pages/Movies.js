import React, { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./Movies.css";
import { Link } from "react-router-dom";
import { searchMovies } from "../api/movies";

const pageSize = 100;

const Movies = () => {
  const [titleFilter, setTitleFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const gridApi = useRef(null);
  const filtersRef = useRef({ title: "", year: "" });

  const datasource = useMemo(() => ({
    rowCount: undefined,
    getRows: async (params) => {
      const page = Math.floor(params.startRow / pageSize) + 1;
      const result = await searchMovies({ ...filtersRef.current, page });

      if (result.error) {
        setTimeout(() => setErrorMessage(result.message), 0);
        params.failCallback();
        return;
      }

      params.successCallback(result.data || [], result.pagination?.total || 0);
    },
  }), []);

  const handleSearch = useCallback(() => {
    filtersRef.current = {
      title: titleFilter.trim(),
      year: yearFilter.trim(),
    };
    setErrorMessage("");

    setTimeout(() => {
      gridApi.current?.purgeInfiniteCache();
      gridApi.current?.ensureIndexVisible(0);
    }, 0);
  }, [titleFilter, yearFilter]);

  const columns = useMemo(() => [
    {
      headerName: "Title",
      field: "title",
      flex: 1,
      cellRenderer: (params) => params.data ? (
        <Link to={`/moviedetails/${params.data.imdbID}`}>{params.value}</Link>
      ) : null,
    },
    { headerName: "Year", field: "year", flex: 1 },
    { headerName: "IMDB Rating", field: "imdbRating", flex: 1 },
    { headerName: "Rotten Tomatoes Rating", field: "rottenTomatoesRating", flex: 1 },
    { headerName: "Metacritic Rating", field: "metacriticRating", flex: 1 },
    { headerName: "Rated", field: "classification", flex: 1 },
  ], []);

  return (
    <div className="movies-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by movie title"
          value={titleFilter}
          onChange={(event) => setTitleFilter(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && handleSearch()}
        />
        <input
          type="text"
          placeholder="Year"
          value={yearFilter}
          onChange={(event) => setYearFilter(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="ag-theme-alpine" style={{ width: "100%" }}>
        <div className="ag-grid-container">
          <AgGridReact
            cacheBlockSize={pageSize}
            columnDefs={columns}
            infiniteInitialRowCount={pageSize}
            maxConcurrentDatasourceRequests={1}
            onGridReady={(params) => {
              gridApi.current = params.api;
              params.api.setDatasource(datasource);
            }}
            rowModelType="infinite"
          />
        </div>
      </div>

      <div className="home-footer">
        <p>All data is from IMDB, Metacritic and RottenTomatoes.</p>
        <p>(c) 2023 Yan Xiong</p>
      </div>
    </div>
  );
};

export default Movies;
