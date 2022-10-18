import "./css/Login.css";
import React, { useState } from "react";
import * as authService from "../services/auth.service";
import { useContext } from "react";
import { AuthContext } from "../App";

function PageLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const value = useContext(AuthContext);

  function handleSubmit(e) {
    e.preventDefault();
    authService
      .login(email, password)
      .then(({ userData, token }) => {
        value.setToken(token);
        onLogin(userData, token);
      })
      .catch((err) => setError(err.message));
  }

    return (
      <main className="container login-cont">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn" type="submit">Login</button>
        </form>
        {error && <p>{error}</p>}
      </main>
    );
}

export default PageLogin;
