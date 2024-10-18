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
  const [form, setForm] = useState({});

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const value = useContext(AuthContext);


  async function handleSubmit(e) {
    //TODO: validate frontend 
    e.preventDefault();
    await authService
      .login(form.email, form.password)
      .then((resp) => {
        if (!resp.err) {
          // console.log(resp.userData);
          value.setToken(resp.token);
          value.setCurrentUser(resp.userData);
          localStorage.setItem("user", JSON.stringify(resp.userData));
          localStorage.setItem("token", resp.token);
          navigate("/", { replace: true });
        } else {
          handleShowToast(resp.err)

        }
      })
  }

  return (
    <div className="login-cont w-100">
      <h1 className="pb-4">Ingresá</h1>
      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-column">

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="text"
            onChange={(e) => setForm(form => { return { ...form, email: e.target.value } })}
          />
        </div>

        <div className="d-flex flex-column">

          <label htmlFor="password">Password</label>
          <div className="d-flex align-items-center">
            <input
              className="w-100 mb-0"
              id="password"
              name="password"
              type={showPassword ? 'text' : "password"}
              onChange={(e) => setForm(form => { return { ...form, password: e.target.value } })}
            />
            <button className="btn btn-link pe-0" type="button" onClick={() => setShowPassword(prev => !prev)}><span className={showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'}></span></button>
          </div>
        </div>
        <p>
        </p>
        <button className="btn submit-btn" type="submit" disabled={Object.values(form).length === 0 || Object.values(form)[0].length === 0}>Login</button>
      </form>
      {/* TODO: OLvidé mi contraseña */}
      <Link className=" d-block text-center mt-4" to="/auth/register">¿Aún no tenés una cuenta? Registrate acá.</Link>
    </div>
  );
}