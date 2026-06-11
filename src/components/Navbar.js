import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { logoutUser } from "../api/auth";

const Navbar = () => {
  const { handleLogout, refresh, user } = useContext(AuthContext);

  const logout = async () => {
    if (refresh) {
      await logoutUser(refresh);
    }
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
  backgroundColor: "#f8f8f8",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
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
  color: "#333",
  fontWeight: "bold",
  margin: "0 10px",
};

const emailStyles = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#666",
  marginRight: "10px",
};

const buttonStyles = {
  backgroundColor: "white",
  border: "1px solid #ccc",
  borderRadius: "4px",
  color: "#666",
  cursor: "pointer",
  fontWeight: "bold",
  padding: "6px 10px",
  textDecoration: "none",
};

export default Navbar;
