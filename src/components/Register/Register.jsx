import "./Register.css";
import React, { useContext, useState } from "react";
import * as UsersService from "../../services/users.service";
import * as authService from "../../services/auth.service";
import { AuthContext } from "../../App";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

export default function Register({ onLogin }) {
  let navigate = useNavigate();
  const handleShowToast = useOutletContext();

  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const value = useContext(AuthContext);

  function handleSubmit(e) {
    //TODO: validate frontend
    e.preventDefault();
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
              className="w-100"
              id="firstName"
              name="firstName"
              type="text"
              value={form?.firstName}
              onChange={(e) => setForm(form => { return { ...form, firstName: e.target.value } })}
            />
          </div>
          <div className="d-flex flex-column w-100">
            <label htmlFor="lastName">Apellido</label>
            <input
              className=" form-control w-100"
              id="lastName"
              name="lastName"
              type="text"
              value={form?.lastName}
              onChange={(e) => setForm(form => { return { ...form, lastName: e.target.value } })}
            />
          </div>
        </div>
        <div className="d-flex flex-column flex-sm-row justify-content-between gap-3">

          <div className="d-flex flex-column w-25">
            <label htmlFor="documentType">Tipo</label>
            <select
              className="form-control w-100"
              id="documentType"
              name="documentType"
              onChange={(e) => setForm(form => { return { ...form, documentType: e.target.value } })}
            >
              <option selected disabled value="">Elegir...</option>
              <option >DNI</option>
              <option>CUIL</option>
              <option>Pasaporte</option>
            </select>
            {/* <input
              className="w-100"
              id="firstName"
              name="firstName"
              type="text"
              value={form?.firstName}
              onChange={(e) => setForm(form => { return { ...form, firstName: e.target.value } })}
            /> */}
          </div>
          <div className="d-flex flex-column w-100">
            <label htmlFor="idDocument">Documento</label>
            <input
              className="w-100"
              id="idDocument"
              name="idDocument"
              type="text"
              value={form?.idDocument}
              onChange={(e) => setForm(form => { return { ...form, idDocument: e.target.value } })}
            />
          </div>
        </div>

        <div className="d-flex flex-column">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="text"
            value={form?.email}
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
              value={form?.password}
              onChange={(e) => setForm(form => { return { ...form, password: e.target.value } })}
            />
            <button className="btn btn-link pe-0" type="button" onClick={() => setShowPassword(prev => !prev)}><span className={showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'}></span></button>
          </div>
        </div>

        <button className="btn submit-btn" type="submit" disabled={Object.values(form).length === 0 || Object.values(form)[0].length === 0}>Registrarse</button>
      </form>
      <Link className=" d-block text-center mt-4" to="/auth/login">¿Ya tenés una cuenta? Ingresá acá.</Link>
    </div>
  );
}