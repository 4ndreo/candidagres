import "./Register.css";
import React, { useContext, useState } from "react";
import * as authService from "../../services/auth.service";
import { AuthContext } from "../../App";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import LoaderMini from "../basics/LoaderMini";
import ReCAPTCHA from "react-google-recaptcha";

export default function Register({ onLogin }) {
  let navigate = useNavigate();
  const value = useContext(AuthContext);
  const handleShowToast = useOutletContext();

  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
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

  function handleRecaptchaChange(e) {
    if (e) {
      setForm({
        ...form,
        recaptcha: e,
      });
      setErrors({
        ...errors,
        recaptcha: '',
      });
    }
  }

  function handleSubmit(e) {
    setLoading(true);
    e.preventDefault();
    if (!form.recaptcha) {
      setLoading(false);

      return setErrors({
        ...errors,
        recaptcha: 'Por favor, completá el captcha.',
      });
    }

    delete form.recaptcha;
    authService.register(form)
      .then((resp) => {
        if (!resp.err) {
          authService
            .login(form.email, form.password)
            .then(({ userData, token }) => {
              value.setToken(token);
              value.setCurrentUser(userData);
              localStorage.setItem("user", JSON.stringify(userData));
              localStorage.setItem("token", token);
              navigate("/", { replace: true });
            })
            .catch((err) => handleShowToast(err.err));
        } else {
          setErrors(resp.err);
        }
        setLoading(false);
      });
  }

  return (
    <div className="register-cont w-100">
      <div className="pb-4">
        <h1 className="mb-0">Creá tu cuenta</h1>
        <small>Todos los campos son requeridos.</small>
      </div>
      <form onSubmit={handleSubmit} noValidate>

        <div className="d-flex flex-column flex-sm-row justify-content-between gap-3">

          <div className="d-flex flex-column w-100">
            <label htmlFor="first_name">Nombre</label>
            <input
              className={"form-control w-100 " + (errors.first_name ? 'is-invalid' : '')}
              id="first_name"
              name="first_name"
              type="text"
              onChange={handleChange}
              required
            />
            <small className="form-text text-danger">
              {errors.first_name}
            </small>
          </div>
          <div className="d-flex flex-column w-100">
            <label htmlFor="last_name">Apellido</label>
            <input
              className={"form-control w-100 " + (errors.last_name ? 'is-invalid' : '')}
              id="last_name"
              name="last_name"
              type="text"
              onChange={handleChange}
              required
            />
            <small className="form-text text-danger">
              {errors.last_name}
            </small>
          </div>
        </div>
        <div className="d-flex flex-sm-row justify-content-between gap-3">

          <div className="d-flex flex-column w-25">
            <label htmlFor="document_type">Tipo</label>
            <select
              className={"form-control w-100 " + (errors.document_type ? 'is-invalid' : '')}
              id="document_type"
              name="document_type"
              defaultValue="0"
              onChange={handleChange}
              required
            >
              <option disabled value="0">Elegir...</option>
              <option >DNI</option>
              <option>CUIL</option>
              <option>Pasaporte</option>
            </select>
            <small className="form-text text-danger">
              {errors.document_type}
            </small>
          </div>
          <div className="d-flex flex-column w-100">
            <label htmlFor="id_document">Documento</label>
            <input
              className={"form-control w-100 " + (errors.id_document ? 'is-invalid' : '')}
              id="id_document"
              name="id_document"
              type="text"
              onChange={handleChange}
              required
            />
            {errors.id_document ?
              <small className="form-text text-danger">
                {errors.id_document}
              </small>
              :
              ((form.document_type === "DNI" &&
                <small className="form-text text-muted">
                  Puede tener 7 u 8 números.
                </small>) ||
                (form.document_type === "CUIL" &&
                  <small className="form-text text-muted">
                    Debe tener el formato XX-XXXXXXXX-X.
                  </small>))
            }

          </div>
        </div>

        <div className="d-flex flex-column">
          <label htmlFor="birth_date">Fecha de nacimiento</label>
          <input
            className={"form-control w-100 " + (errors.birth_date ? 'is-invalid' : '')}
            id="birth_date"
            name="birth_date"
            type="date"
            onChange={handleChange}
            required
          />
          <small className="form-text text-danger">
            {errors.birth_date}
          </small>
        </div>
        <div className="d-flex flex-column">
          <label htmlFor="email">Email</label>
          <input
            className={"form-control w-100 " + (errors.email ? 'is-invalid' : '')}
            id="email"
            name="email"
            type="email"
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
          <ReCAPTCHA
            name="recaptcha"
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
            onChange={handleRecaptchaChange}
          />
          <small className="form-text text-danger">
            {errors.recaptcha}
          </small>
        </div>
        <button className="btn btn-primary submit-btn d-flex justify-content-center" type="submit" disabled={Object.values(form).length === 0 || loading}>{loading ? <span className='mini-loader-cont'>
          <LoaderMini></LoaderMini>
        </span> : 'Registrarse'}</button>
      </form>
      <Link className=" d-block text-center mt-4" to="/auth/login">¿Ya tenés una cuenta? Ingresá acá.</Link>
    </div>
  );
}