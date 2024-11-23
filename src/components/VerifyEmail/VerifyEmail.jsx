import "./VerifyEmail.css";
import React, { useState } from "react";
import * as authService from "../../services/auth.service";
import { useContext } from "react";
import { AuthContext } from "../../App";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoaderMini from "../basics/LoaderMini";

export default function VerifyEmail({ props }) {

  let value = useContext(AuthContext);
  let navigate = useNavigate();
  const params = useParams();

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
      .verifyEmail(params.id, form.verificationCode)
      .then((resp) => {
        if (!resp.err) {
          value.setVerifyEmailCode(form.verificationCode);
          props.setShowToast({ show: true, title: 'Éxito', message: 'Código válido', variant: 'success', position: 'top-end' });
          navigate(`/auth/change-password/${params.id}`);
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
    <div className="verify-email-cont w-100">
      <h1 className="pb-4">Validá tu email</h1>
      <p>Por favor, ingresá el código de verificación que enviamos a tu email. Si luego de unos minutos no ves el correo, verificá tu casilla de spam o <Link to='/auth/forgot-password'>volvé a intentar.</Link></p>
      <form onSubmit={handleSubmit} noValidate>
        <div className="d-flex flex-column">

          <label htmlFor="verificationCode">Código de verificación</label>
          <input
            className={"form-control w-100 " + (errors.verificationCode ? 'is-invalid' : '')}
            id="verificationCode"
            name="verificationCode"
            type="text"
            onChange={handleChange}
            placeholder="123456"
            required
          />
          <small className="form-text text-danger">
            {errors.verificationCode}
          </small>
        </div>
        <button className="btn submit-btn d-flex justify-content-center" type="submit" disabled={Object.values(form).length === 0 || Object.values(form)[0].length === 0 || loading}>{loading ? <span className='mini-loader-cont'>
          <LoaderMini></LoaderMini>
        </span> : 'Restaurar contraseña'}</button>
      </form>
    </div>
  );
}