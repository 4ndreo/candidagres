import "./FormClass.css";
import React, { useEffect, useState } from "react";
import * as classesService from "../../services/classes.service";
// import * as mediaService from "../../services/media.service";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../basics/Loader";
import BackBtn from "../BackBtn/BackBtn";

// const imageMimeType = /image\/(png|jpg|jpeg)/i;

export default function FormClass({ props }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  let navigate = useNavigate();
  const params = useParams();

  const [form, setForm] = useState({
    title: "",
    teacher: "",
    description: "",
    price: 0,
    min_age: 0,
  });
  const [error, setError] = useState(null);

  async function fetchClass(id) {
    setIsLoading(true);

    classesService
      .findById(id)
      .then((data) => {
        delete data._id
        setForm(data);
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    if (params?.id) {
      fetchClass(params?.id);
    }
  }, [params?.id]);


  const [errors, setErrors] = useState({});
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
      classesService
        .update(params?.id, {
          title: form.title,
          teacher: form.teacher,
          description: form.description,
          price: form.price,
          min_age: form.min_age,
        })
        .then((resp) => {
          if (!resp.err) {
            props.setShowToast({ show: true, title: 'Éxito', message: 'La clase ha sido modificada.', variant: 'success', position: 'top-end' });
            navigate("/admin/classes");
            setIsSaving(false);

          } else {
            setErrors(resp.err);
            setIsSaving(false);

          }
        }).catch((err) => { props.setShowToast({ show: true, title: 'Error al modificar el clase', message: 'Inténtelo de nuevo más tarde', variant: 'danger', position: 'top-end' }); setIsSaving(false); });

    } else {
      classesService
        .create({
          title: form.title,
          teacher: form.teacher,
          description: form.description,
          price: form.price,
          min_age: form.min_age,
        })
        .then((resp) => {
          if (!resp.err) {
            props.setShowToast({ show: true, title: 'Éxito', message: 'La clase ha sido creada.', variant: 'success', position: 'top-end' });
            navigate("/admin/classes");
            setIsSaving(false);
          } else {
            setErrors(resp.err);
            setIsSaving(false);
          }
        }).catch((err) => {
          props.setShowToast({ show: true, title: 'Error al crear el clase', message: 'Inténtelo de nuevo más tarde', variant: 'danger', position: 'top-end' });
          setIsSaving(false);
        });
    }
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

  // if (class) {
  return (
    <div className="container cont-admin-form-classes">
      <BackBtn props={{ url: '/admin/classes' }} />
      <h1>{params?.id ? 'Editar' : 'Crear'} - {props.title}</h1>

      {error ? renderError() :
        <form onSubmit={handleSubmit} noValidate>
          <div className="d-flex flex-column flex-sm-row justify-content-between gap-3">
            <div className="d-flex flex-column w-100">
              <label htmlFor="title" className="form-label">Título</label>
              <input
                className={"form-control w-100 " + (errors.title ? 'is-invalid' : '')}
                id="title"
                name="title"
                type="text"
                placeholder="¿Cual es el título de la clase?"
                defaultValue={form.title}
                onChange={handleChange}
                required
              />
              <small className="form-text text-danger">
                {errors.title}
              </small>
            </div>
            <div className="d-flex flex-column w-100">
              <label htmlFor="teacher" className="form-label">Docente</label>
              <input
                className={"form-control w-100 " + (errors.teacher ? 'is-invalid' : '')}
                id="teacher"
                name="teacher"
                type="text"
                placeholder="¿Cómo se llama la/el docente?"
                defaultValue={form.teacher}
                onChange={handleChange}
                required
              />
              <small className="form-text text-danger">
                {errors.teacher}
              </small>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="form-label">Descripción</label>
            <textarea
              rows={4}
              className={"form-control w-100 " + (errors.description ? 'is-invalid' : '')}
              id="description"
              name="description"
              type="text"
              placeholder="Redactá una descripción detallada sobre la clase. Podés incluir detalles sobre los artículos a diseñar, materiales, objetivos, etc."
              defaultValue={form.description}
              onChange={handleChange}
              required
            ></textarea>
            <small className="form-text text-danger">
              {errors.description}
            </small>
          </div>
          <div className="d-flex flex-column flex-sm-row gap-3">

            <div className="w-100">
              <label htmlFor="min_age" className="form-label">Edad mínima</label>
              <div className="input-group">

                <input
                  className={"form-control  " + (errors.min_age ? 'is-invalid' : '')}
                  id="min_age"
                  name="min_age"
                  type="number"
                  min={0}
                  max={120}
                  defaultValue={parseInt(form.min_age)}
                  onChange={handleChange}
                  required
                />
                <div className="input-group-append">
                  <span className="input-group-text">años</span>
                </div>
              </div>
              <small className="form-text text-danger">
                {errors.min_age}
              </small>

            </div>
            <div className="w-100">
              <label htmlFor="price" className="form-label">Valor de la cuota mensual</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">$</span>
                </div>
                <input
                  className={"form-control  " + (errors.price ? 'is-invalid' : '')}
                  id="price"
                  name="price"
                  type="number"
                  min={0}
                  defaultValue={parseInt(form.price)}
                  onChange={handleChange}
                  required
                />
                <div className="input-group-append">
                  <span className="input-group-text">.00</span>
                </div>
              </div>
              <small className="form-text text-danger">
                {errors.price}
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
              <span> Guardar clase</span>
            }
          </button>
        </form>
      }
    </div>
  );
  // }
}
