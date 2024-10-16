import "./Login.css";
import React, { useState } from "react";
import * as authService from "../../services/auth.service";
import { useContext } from "react";
import { AuthContext } from "../../App";
import CustomToast from "../basics/CustomToast/CustomToast";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

export default function Login() {

  let navigate = useNavigate();
  const handleShowToast = useOutletContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const value = useContext(AuthContext);


  async function handleSubmit(e) {
    e.preventDefault();
    await authService
      .login(email, password)
      .then(({ userData, token }) => {
        console.log(userData);
        value.setToken(token);
        value.setCurrentUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.log(err)
        handleShowToast(err.message)
      });
  }

  return (
    <div className="login-cont w-100">
      <h1 className="pb-4">Ingresá</h1>
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

        <button className="btn" type="submit">Login</button>
      </form>
      <Link className=" d-block text-center pt-4" to="/auth/register">¿Aún no tenés una cuenta? Registrate acá.</Link>
    </div>
  );
}