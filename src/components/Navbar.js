import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import ThemeToggle from "./ThemeToggle";
import "./Navbar.css";

const Navbar = () => {
  const { handleLogout, user } = useContext(AuthContext);

  return (
    <header className="site-header">
      <Link className="brand-link" to="/">
        <span className="brand-mark">M</span>
        <span className="brand-text">Movie Searching</span>
      </Link>

      <nav className="primary-nav" aria-label="Primary navigation">
        <NavLink exact activeClassName="active" to="/">
          Home
        </NavLink>
        <NavLink activeClassName="active" to="/movies">
          Movies
        </NavLink>
      </nav>

      <div className="header-actions">
        <ThemeToggle />
        {user ? (
          <>
            <span className="user-email">{user.email}</span>
            <button className="header-button" onClick={handleLogout} type="button">
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink className="header-link" activeClassName="active" to="/register">
              Register
            </NavLink>
            <NavLink className="header-button" activeClassName="active" to="/login">
              Login
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
