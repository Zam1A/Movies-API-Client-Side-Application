import React, { useContext, useState } from "react";
import "./AuthForm.css";
import image4 from "../images/image4.jpg";
import { loginUser } from "../api/auth";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { handleLogin } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoginSuccess(false);

    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }

    try {
      const data = await loginUser(email, password);
      if (data.error) {
        setErrorMessage(data.message);
        return;
      }
      handleLogin(data, email);
      setLoginSuccess(true);
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="container" style={{ backgroundImage: `url(${image4})` }}>
      <div className="form-container">
        <h2 className="title">Login</h2>
        {loginSuccess && <p className="success-message">Login successful!</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit">Login</button>
        </form>
        <div className="switch">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
