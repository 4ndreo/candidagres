// Styles
import "./FormUser.css";

// React
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Services
import * as usersService from "../../services/users.service";
import { roles } from "../../data/roles";

// Components
import Loader from "../basics/Loader";

// Cloudinary
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage } from "@cloudinary/react";
import { defaultImage } from "@cloudinary/url-gen/actions/delivery";
import BackBtn from "../BackBtn/BackBtn";


export default function FormUser({ props }) {

  let navigate = useNavigate();
  const params = useParams();

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialForm, setInitialForm] = useState();
  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  async function fetchUser(id) {
    setIsLoading(true);

    await usersService
      .findById(id)
      .then((data) => {
        delete data._id
        setInitialForm(data);
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    if (params?.id) {
      fetchUser(params?.id);
    }
  }, [params?.id]);


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
    setIsSaving(true);
    if (params?.id) {
      usersService
        .update(params?.id, form)
        .then((resp) => {
          if (!resp.err) {
            props.setShowToast({ show: true, title: 'Éxito', message: 'Se ha modificado el usuario.', variant: 'success', position: 'top-end' });
            navigate("/admin/users");
            setIsSaving(false);
          } else {
            setErrors(resp.err);
            setIsSaving(false);
          }
        }).catch((err) => { props.setShowToast({ show: true, title: 'Error al modificar el usuario', message: 'Inténtelo de nuevo más tarde', variant: 'danger', position: 'top-end' }); setIsSaving(false); });

    } else {
      usersService
        .create(form)
        .then((resp) => {
          if (!resp.err) {
            props.setShowToast({ show: true, title: 'Éxito', message: 'Se ha creado el usuario.', variant: 'success', position: 'top-end' });
            navigate("/admin/users");
            setIsSaving(false);
          } else {
            setErrors(resp.err);
            setIsSaving(false);
          }
        }).catch((err) => { props.setShowToast({ show: true, title: 'Error al crear el usuario', message: 'Inténtelo de nuevo más tarde', variant: 'danger', position: 'top-end' }); setIsSaving(false); });
    }
  }

  const renderImage = () => {
    const cld = new Cloudinary({ cloud: { cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME } });
    const img = cld
      .image(initialForm?.image ? `profile/${initialForm?.image}` : 'placeholder-image')
      .format('auto')
      .quality('auto')
      .resize(auto().gravity(autoGravity()))
      .delivery(defaultImage("placeholder-image.jpg"));
    return (
      <div className="text-center mb-4">
        <AdvancedImage className="avatar-img" cldImg={img} alt="Imagen de perfil del usuario" />
      </div>
    )
  }

  const renderError = () => {
    return (
      <div className="alert alert-danger" role="alert">
        {error.message}
      </div>
    )
  }

  if (isLoading) {
    return <Loader></Loader>
  }

  return (
    <div className="container cont-admin-form-users">
      <BackBtn props={{ url: '/admin/users' }} />
      <h1>{params?.id ? 'Editar' : 'Crear'} - {props.title}</h1>

      {error ? renderError() :
        <>
          {renderImage()}

          <form onSubmit={handleSubmit} noValidate>
            <div className="d-flex flex-column flex-sm-row justify-content-between gap-3">
              <div className="d-flex flex-column w-100">
                <label htmlFor="email">Email</label>
                <input
                  className={"form-control w-100 " + (errors.email ? 'is-invalid' : '')}
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={initialForm?.email}
                  onChange={(e) => handleChange(e)}
                  required
                  disabled={params?.id}
                />
                <small className="form-text text-danger">
                  {errors.email}
                </small>
              </div>
              {!params?.id && <div className="d-flex flex-column  w-100">
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
              </div>}
            </div>
            <div className="d-flex flex-column flex-sm-row justify-content-between gap-3">

              <div className="d-flex flex-column w-100">
                <label htmlFor="first_name">Nombre</label>
                <input
                  className={"form-control w-100 " + (errors.first_name ? 'is-invalid' : '')}
                  id="first_name"
                  name="first_name"
                  type="text"
                  defaultValue={initialForm?.first_name}
                  onChange={(e) => handleChange(e)}
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
                  defaultValue={initialForm?.last_name}
                  onChange={(e) => handleChange(e)}
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
                  defaultValue={initialForm?.document_type ?? 0}
                  onChange={(e) => handleChange(e)}
                  required
                >
                  <option disabled value="0">Elegir...</option>
                  <option>DNI</option>
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
                  defaultValue={initialForm?.id_document}
                  onChange={(e) => handleChange(e)}
                  required
                />
                {errors.id_document ?
                  <small className="form-text text-danger">
                    {errors.id_document}
                  </small>
                  :
                  ((form?.document_type === "DNI" &&
                    <small className="form-text text-muted">
                      Puede tener 7 u 8 números.
                    </small>) ||
                    (form?.document_type === "CUIL" &&
                      <small className="form-text text-muted">
                        Debe tener el formato XX-XXXXXXXX-X.
                      </small>))
                }

              </div>

            </div>
            <div className="d-flex flex-column flex-sm-row justify-content-between gap-3">

              <div className="d-flex flex-column  w-100">
                <label htmlFor="birth_date">Fecha de nacimiento</label>
                <input
                  className={"form-control w-100 " + (errors.birth_date ? 'is-invalid' : '')}
                  id="birth_date"
                  name="birth_date"
                  type="date"
                  defaultValue={initialForm?.birth_date}
                  onChange={(e) => handleChange(e)}
                  required
                />
                <small className="form-text text-danger">
                  {errors.birth_date}
                </small>
              </div>
              <div className="d-flex flex-column  w-100">
                <label htmlFor="birth_date">Rol</label>
                <select
                  className={"form-control w-100 " + (errors.role ? 'is-invalid' : '')}
                  id="role"
                  name="role"
                  defaultValue={initialForm?.role ?? 0}
                  onChange={(e) => handleChange(e)}
                  required
                >
                  <option disabled value="0">Elegir...</option>

                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                <small className="form-text text-danger">
                  {errors.role}
                </small>
              </div>
            </div>
            <button
              className="btn btn-primary mt-4"
              type={isSaving ? "button" : "submit"}
              disabled={isSaving}
              data-toggle="tooltip"
              data-placement="top">
              {isSaving ?
                <><span className='pi pi-spin pi-spinner'></span><span> Guardando...</span> </> :
                <span> Guardar usuario</span>
              }
            </button>
          </form>
        </>
      }
    </div>
  );
}
