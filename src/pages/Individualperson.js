import React from "react";
import { Link } from "react-router-dom";
import "./Individualperson.css";

const Individualperson = () => (
  <div className="page-container">
    <div className="center-content">
      <h1 className="center-text">Actor Profiles</h1>
      <p className="center-text">
        Actor profile pages are not available from OMDb.
      </p>
      <div className="center-button">
        <Link to="/movies">Back to Movies</Link>
      </div>
    </div>
    <div className="home-footer">
      <p>Movie data is provided by OMDb.</p>
      <p>(c) 2023 Yan Xiong</p>
    </div>
  </div>
);

export default Individualperson;
