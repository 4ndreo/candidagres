import "./ForgotPassword.css";
import React, { useState } from "react";
import * as authService from "../../services/auth.service";
import { useContext } from "react";
import { AuthContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import LoaderMini from "../basics/LoaderMini";

export default function ForgotPassword({ props }) {

  let navigate = useNavigate();
  const value = useContext(AuthContext);

  const [form, setForm] = useState({});
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
      .restorePassword(form.email)
      .then((resp) => {
        if (!resp.err) {
          props.setShowToast({ show: true, title: 'Éxito', message: 'Se envió el correo para restaurar tu contraseña.', variant: 'success', position: 'top-end' });
          navigate(`/auth/verify-email/${resp.id_user}`);
        } else {
          setErrors(resp.err);
        }
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      })
  }

  return (
    <div className="forgot-password-cont w-100">
      <h1 className="pb-4">Ingresá tu email</h1>
      <p>Vamos a enviarte un correo para que puedas restaurar tu contraseña.</p>
      <form onSubmit={handleSubmit} noValidate>
        <div className="d-flex flex-column">

          <label htmlFor="email">Email</label>
          <input
            className={"form-control w-100 " + (errors.email ? 'is-invalid' : '')}
            id="email"
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="tunombre@email.com"
            required
          />
          <small className="form-text text-danger">
            {errors.email}
          </small>
        </div>
        <button className="btn submit-btn d-flex justify-content-center" type="submit" disabled={Object.values(form).length === 0 || Object.values(form)[0].length === 0 || loading}>{loading ? <span className='mini-loader-cont'>
          <LoaderMini></LoaderMini>
        </span> : 'Restaurar contraseña'}</button>
        {/* TODO: Add loader when login is in progress */}
      </form>
      {/* TODO: OLvidé mi contraseña */}
      <Link className=" d-block text-center mt-4" to="/auth/login">¿Recordaste tu contraseña? Ingresá acá.</Link>
    </div>
  );
}