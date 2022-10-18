import React, { useContext, useState } from "react";
import * as UsersService from "../services/users.service";
import * as authService from "../services/auth.service";
import { AuthContext } from "../App";

function PageRegister({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const value = useContext(AuthContext);

  function handleSubmit(e) {
    e.preventDefault();
    UsersService.create({ email, password, role:2 }).then((user) => {
      authService
        .login(email, password)
        .then(({ userData, token }) => {
          value.setToken(token);
          onLogin(userData, token);
        })
        .catch((err) => setError(err.message));
    });
  }

  return (
    <main className="container login-cont">
      <h1>Registrarse</h1>
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

        <button type="submit">Registrarse</button>
      </form>
      {error && <p>{error}</p>}
    </main>
  );
}

export default PageRegister;
