import "./Register.css";
import React, { useContext, useState } from "react";
import * as UsersService from "../../services/users.service";
import * as authService from "../../services/auth.service";
import { AuthContext } from "../../App";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

export default function Register({ onLogin }) {
  let navigate = useNavigate();
  const handleShowToast = useOutletContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const value = useContext(AuthContext);

  function handleSubmit(e) {
    e.preventDefault();
    UsersService.create({ email, password })
    .then((user) => {
      if (!user.err) {
        authService
          .login(email, password)
          .then(({ userData, token }) => {
            value.setToken(token);
            value.setCurrentUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("token", token);
            navigate("/", { replace: true });
          })
          .catch((err) => handleShowToast(err.err));
      } else {
        handleShowToast(user.err)
      }
    });
  }

  return (
    <div className="register-cont w-100">
      <h1 className="pb-4">Creá tu cuenta</h1>
      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-column">

          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="d-flex flex-column">

          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn" type="submit">Registrarse</button>
      </form>
      <Link className=" d-block text-center pt-4" to="/auth/login">¿Ya tenés una cuenta? Ingresá acá.</Link>
    </div>
  );
}