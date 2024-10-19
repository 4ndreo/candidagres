import "./Register.css";
import React, { useContext, useState } from "react";
import * as UsersService from "../../services/users.service";
import * as authService from "../../services/auth.service";
import { AuthContext } from "../../App";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { validateCUIL, validateDNI, validateEmail, validatePassport, validatePassword } from "../../utils/validators";

export default function Register({ onLogin }) {
  let navigate = useNavigate();
  const value = useContext(AuthContext);
  const handleShowToast = useOutletContext();

  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  function validate() {
    const newErrors = {};

    if (form.firstName?.length <= 0 || !form.firstName) newErrors.firstName = 'Debe completar el nombre';
    if (form.lastName?.length <= 0 || !form.lastName) newErrors.lastName = 'Debe completar el apellido';
    if (validateEmail(form.email)) newErrors.email = validateEmail(form.email);
    if (validatePassword(form.password)) newErrors.password = validatePassword(form.password);

    switch (form.documentType) {
      case 'DNI':
        if (validateDNI(form.idDocument)) newErrors.idDocument = validateDNI(form.idDocument)
        break;
      case 'CUIL':
        if (validateCUIL(form.idDocument)) newErrors.idDocument = validateCUIL(form.idDocument)
        break;
      case 'Pasaporte':
        if (validatePassport(form.idDocument)) newErrors.idDocument = validatePassport(form.idDocument)
        break;
      default:
        newErrors.documentType = 'Debe ingresar un tipo de documento válido.'
    }

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

  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      UsersService.create(form)
        .then((user) => {
          if (!user.err) {
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
            handleShowToast(user.err)
          }
        });
    }
  }

  return (
    <div className="register-cont w-100">
      <div className="pb-4">
        <h1 className="mb-0">Creá tu cuenta</h1>
        <small>Todos los campos son requeridos.</small>
      </div>
      <form onSubmit={handleSubmit}>

        <div className="d-flex flex-column flex-sm-row justify-content-between gap-3">

          <div className="d-flex flex-column w-100">
            <label htmlFor="firstName">Nombre</label>
            <input
              className={"form-control w-100 " + (errors.firstName ? 'is-invalid' : '')}
              id="firstName"
              name="firstName"
              type="text"
              // value={form?.firstName}
              onChange={handleChange}
            />
            <small class="form-text text-danger">
              {errors.firstName}
            </small>
          </div>
          <div className="d-flex flex-column w-100">
            <label htmlFor="lastName">Apellido</label>
            <input
              className={"form-control w-100 " + (errors.lastName ? 'is-invalid' : '')}
              id="lastName"
              name="lastName"
              type="text"
              // value={form?.lastName}
              onChange={handleChange}
            />
            <small class="form-text text-danger">
              {errors.lastName}
            </small>
          </div>
        </div>
        <div className="d-flex flex-sm-row justify-content-between gap-3">

          <div className="d-flex flex-column w-25">
            <label htmlFor="documentType">Tipo</label>
            <select
              className={"form-control w-100 " + (errors.documentType ? 'is-invalid' : '')}
              id="documentType"
              name="documentType"
              defaultValue="0"
              onChange={handleChange}
            >
              <option disabled value="0">Elegir...</option>
              <option >DNI</option>
              <option>CUIL</option>
              <option>Pasaporte</option>
            </select>
            <small class="form-text text-danger">
              {errors.documentType}
            </small>
          </div>
          <div className="d-flex flex-column w-100">
            <label htmlFor="idDocument">Documento</label>
            <input
              className={"form-control w-100 " + (errors.idDocument ? 'is-invalid' : '')}
              id="idDocument"
              name="idDocument"
              type="text"
              // value={form?.idDocument}
              onChange={handleChange}
            />
            <small class="form-text text-danger">
              {errors.idDocument}
            </small>
          </div>
        </div>

        <div className="d-flex flex-column">
          <label htmlFor="email">Email</label>
          <input
            className={"form-control w-100 " + (errors.email ? 'is-invalid' : '')}
            id="email"
            name="email"
            type="text"
            // value={form?.email}
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
              // value={form?.password}
              onChange={handleChange}
            />
            <button className="btn btn-link pe-0" type="button" onClick={() => setShowPassword(prev => !prev)}><span className={showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'}></span></button>
          </div>
          <small class="form-text text-danger">
            {errors.password}
          </small>
        </div>

        <button className="btn submit-btn" type="submit" disabled={Object.values(form).length === 0}>Registrarse</button>
      </form>
      <Link className=" d-block text-center mt-4" to="/auth/login">¿Ya tenés una cuenta? Ingresá acá.</Link>
    </div>
  );
}