import "./Login.css";
import React, { useState } from "react";
import * as authService from "../../services/auth.service";
import { useContext } from "react";
import { AuthContext } from "../../App";
import CustomToast from "../basics/CustomToast/CustomToast";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { validateEmail, validatePassword } from "../../utils/validators";

export default function Login() {

  let navigate = useNavigate();
  const value = useContext(AuthContext);
  const handleShowToast = useOutletContext();

  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const newErrors = {};

    if (validateEmail(form.email)) newErrors.email = validateEmail(form.email);
    if (validatePassword(form.password)) newErrors.password = validatePassword(form.password);

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

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
    //TODO: validate frontend 
    e.preventDefault();
    if (validate()) {
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
  }

  return (
    <div className="login-cont w-100">
      <h1 className="pb-4">Ingresá</h1>
      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-column">

          <label htmlFor="email">Email</label>
          <input
            className={"form-control w-100 " + (errors.email ? 'is-invalid' : '')}
            id="email"
            name="email"
            type="text"
            onChange={handleChange}
          />
          <small class="form-text text-danger">
            {errors.email}
          </small>
        </div>

        <div className="d-flex flex-column">
          <label htmlFor="password">Password</label>
          <div className="d-flex align-items-center">
            <input
              className={"form-control mb-0 w-100 " + (errors.password ? 'is-invalid' : '')}
              id="password"
              name="password"
              type={showPassword ? 'text' : "password"}
              onChange={handleChange}
            />
            <button className="btn btn-link pe-0" type="button" onClick={() => setShowPassword(prev => !prev)}><span className={showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'}></span></button>
          </div>
        <small class="form-text text-danger">
          {errors.password}
        </small>
        </div>
        <button className="btn submit-btn" type="submit" disabled={Object.values(form).length === 0 || Object.values(form)[0].length === 0}>Login</button>
      </form>
      {/* TODO: OLvidé mi contraseña */}
      <Link className=" d-block text-center mt-4" to="/auth/register">¿Aún no tenés una cuenta? Registrate acá.</Link>
    </div>
  );
}