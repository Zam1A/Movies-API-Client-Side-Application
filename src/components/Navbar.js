import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const Navbar = () => {
  const { handleLogout, user } = useContext(AuthContext);

  const logout = () => {
    handleLogout();
  };

  return (
    <nav style={navStyles}>
      <div style={titleStyles}>Movie Searching</div>
      <ul style={ulStyles}>
        <li>
          <Link to="/" style={linkStyles}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/movies" style={linkStyles}>
            Movies
          </Link>
        </li>
        {user ? (
          <>
            <li style={emailStyles}>{user.email}</li>
            <li>
              <button onClick={logout} style={buttonStyles}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/register" style={linkStyles}>
                Register
              </Link>
            </li>
            <li>
              <Link to="/login" style={linkStyles}>
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

const navStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "60px",
  padding: "0 20px",
  backgroundColor: "var(--nav-bg)",
  boxShadow: "0 2px 5px var(--shadow-color)",
};

const titleStyles = {
  fontWeight: "bold",
  fontSize: "20px",
  color: "#00BFFF",
};

const ulStyles = {
  display: "flex",
  alignItems: "center",
  listStyleType: "none",
  margin: 0,
  padding: 0,
};

const linkStyles = {
  textDecoration: "none",
  color: "var(--text-color)",
  fontWeight: "bold",
  margin: "0 10px",
};

const emailStyles = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "var(--muted-text)",
  marginRight: "10px",
};

const buttonStyles = {
  backgroundColor: "var(--panel-bg)",
  border: "1px solid var(--border-color)",
  borderRadius: "4px",
  color: "var(--text-color)",
  cursor: "pointer",
  fontWeight: "bold",
  padding: "6px 10px",
  textDecoration: "none",
};

export default Navbar;
