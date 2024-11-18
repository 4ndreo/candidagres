import "./ChangePassword.css";
import React, { useState } from "react";
import * as authService from "../../services/auth.service";
import { useContext } from "react";
import { AuthContext } from "../../App";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoaderMini from "../basics/LoaderMini";

export default function ChangePassword({ props }) {

  let navigate = useNavigate();
  const value = useContext(AuthContext);
  const params = useParams();

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
      .changePassword(params.id, value.verifyEmailCode, { password: form.password, confirm_password: form.confirm_password })
      .then((resp) => {
        if (!resp.err) {
          value.setVerifyEmailCode(null);
          props.setShowToast({ show: true, title: 'Éxito', message: 'Cambiaste tu contraseña.', variant: 'success', position: 'top-end' });
          navigate(`/auth/login`);
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
      <h1 className="pb-4">Cambiá tu contraseña</h1>
      <p>Ingresá una nueva contraseña para tu cuenta.</p>
      <form onSubmit={handleSubmit} noValidate>
        <div className="d-flex flex-column">
          <label htmlFor="password">Nueva contraseña</label>
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
        </div>
        <div className="d-flex flex-column">
          <label htmlFor="confirm_password">Confirmar contraseña</label>
          <div className="d-flex align-items-center">
            <input
              className={"form-control mb-0 w-100 " + (errors.confirm_password ? 'is-invalid' : '')}
              id="confirm_password"
              name="confirm_password"
              type={showPassword ? 'text' : "password"}
              placeholder="********"
              onChange={handleChange}
              required
            />
            <button className="btn btn-link pe-0" type="button" onClick={() => setShowPassword(prev => !prev)}><span className={showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'}></span></button>
          </div>
          <small className="form-text text-danger">
            {errors.confirm_password}
          </small>
        </div>
        {errors.verification_code && <small className="form-text text-danger">
          {errors.verification_code} <Link to="/auth/forgot-password">Hacé click acá para recibir uno nuevo.</Link>
        </small>}
        <button className="btn submit-btn d-flex justify-content-center" type="submit" disabled={Object.values(form).length === 0 || Object.values(form)[0].length === 0 || loading}>{loading ? <span className='mini-loader-cont'>
          <LoaderMini></LoaderMini>
        </span> : 'Cambiar contraseña'}</button>
      </form>
    </div>
  );
}