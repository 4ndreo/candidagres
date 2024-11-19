import "./Login.css";
import React, { useState } from "react";
import * as authService from "../../services/auth.service";
import { useContext } from "react";
import { AuthContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import LoaderMini from "../basics/LoaderMini";

export default function Login() {

  let navigate = useNavigate();
  const value = useContext(AuthContext);

  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  function handleChange(e) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
  }

  async function handleSubmit(e) {
    setLoading(true);
    e.preventDefault();
    await authService
      .login(form.email, form.password)
      .then((resp) => {
        if (!resp.err) {
          value.setToken(resp.token);
          value.setCurrentUser(resp.userData);
          localStorage.setItem("user", JSON.stringify(resp.userData));
          localStorage.setItem("token", resp.token);
          navigate("/", { replace: true });
        } else {
          setErrors(resp.err);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="login-cont w-100">
      <h1 className="pb-4">Ingresá</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="d-flex flex-column">

          <label htmlFor="email">Email</label>
          <input
            className={"form-control w-100 " + (errors.email ? 'is-invalid' : '')}
            id="email"
            name="email"
            type="email"
            placeholder="tunombre@email.com"
            onChange={handleChange}
            required
          />
          <small className="form-text text-danger">
            {errors.email}
          </small>
        </div>

        <div className="d-flex flex-column">
          <label htmlFor="password">Contraseña</label>
          <div className="d-flex align-items-center">
            <input
              className={"form-control mb-0 w-100 " + (errors.password ? 'is-invalid' : '')}
              id="password"
              name="password"
              type={showPassword ? 'text' : "password"}
              placeholder="********"
              onChange={handleChange}
              required
            />
            <button className="btn btn-link pe-0" type="button" onClick={() => setShowPassword(prev => !prev)}><span className={showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'}></span></button>
          </div>
          <small className="form-text text-danger">
            {errors.password}
          </small>
          <small>¿Olvidaste tu contraseña? <Link to="/auth/forgot-password">Recuperala.</Link></small>
        </div>
        <button className="btn submit-btn d-flex justify-content-center" type="submit" disabled={Object.values(form).length === 0 || Object.values(form)[0].length === 0 || loading}>{loading ? <span className='mini-loader-cont'>
          <LoaderMini></LoaderMini>
        </span> : 'Iniciar sesión'}</button>
      </form>
      <Link className=" d-block text-center mt-4" to="/auth/register">¿Aún no tenés una cuenta? Registrate acá.</Link>
    </div>
  );
}