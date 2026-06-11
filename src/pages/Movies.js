import React, { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./Movies.css";
import { Link } from "react-router-dom";
import { searchMovies } from "../api/movies";

const pageSize = 10;

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
      const result = await searchMovies({
        ...filtersRef.current,
        filterModel: params.filterModel,
        page,
        sortModel: params.sortModel,
      });

      if (result.error) {
        setTimeout(() => setErrorMessage(result.message), 0);
        params.successCallback([], 0);
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

  const defaultColDef = useMemo(() => ({
    filter: true,
    floatingFilter: true,
    resizable: true,
    sortable: true,
    suppressMenu: false,
  }), []);

  const columns = useMemo(() => [
    {
      headerName: "",
      field: "poster",
      filter: false,
      width: 88,
      cellRenderer: (params) => (
        params.value ? (
          <img className="movie-thumb" src={params.value} alt="" />
        ) : (
          <span className="movie-thumb-placeholder">No poster</span>
        )
      ),
      sortable: false,
    },
    {
      headerName: "Title",
      field: "title",
      filter: "agTextColumnFilter",
      flex: 1,
      cellRenderer: (params) => params.data ? (
        <Link to={`/moviedetails/${params.data.imdbID}`}>{params.value}</Link>
      ) : null,
    },
    {
      headerName: "Year",
      field: "year",
      filter: "agTextColumnFilter",
      width: 120,
    },
    {
      headerName: "Type",
      field: "classification",
      filter: "agTextColumnFilter",
      width: 140,
    },
  ], []);

  return (
    <div className="movies-container">
      <section className="movies-search-panel">
        <div>
          <p className="movies-eyebrow">OMDb Search</p>
          <h1>Find Movies</h1>
        </div>
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
          <button className="search-button" onClick={handleSearch}>Search</button>
        </div>
      </section>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="ag-theme-alpine" style={{ width: "100%" }}>
        <div className="ag-grid-container">
          <AgGridReact
            cacheBlockSize={pageSize}
            columnDefs={columns}
            defaultColDef={defaultColDef}
            infiniteInitialRowCount={pageSize}
            maxConcurrentDatasourceRequests={1}
            onGridReady={(params) => {
              gridApi.current = params.api;
              params.api.setDatasource(datasource);
            }}
            rowHeight={72}
            rowModelType="infinite"
          />
        </div>
      </div>

      <div className="home-footer">
        <p>Movie data is provided by OMDb.</p>
        <p>(c) 2023 Yan Xiong</p>
      </div>
    </div>
  );
};

export default Movies;
