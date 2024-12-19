// Styles
import "./FormShift.css";

// React
import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { useQuery } from "react-query";

// Services
import * as shiftsService from "../../services/shifts.service";
import * as classesService from "../../services/classes.service";

// Components
import Loader from "../basics/Loader";
import { weekdays } from '../../data/shifts';

// External Libraries
import { Dropdown } from "react-bootstrap";
import BackBtn from "../BackBtn/BackBtn";

export default function FormShift({ props }) {
  const [isLoading, setIsLoading] = useState(false);

  let navigate = useNavigate();
  const params = useParams();

  const [form, setForm] = useState({
    title: "",
    id_class: "",
    description: "",
    start_time: "",
    end_time: "",
    max_places: 0,
    days: [],
  });
  const [error, setError] = useState(null);

  async function fetchShift(id) {
    setIsLoading(true);

    shiftsService
      .findById(id)
      .then((comisión) => {
        delete comisión._id
        setForm(comisión);
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    if (params?.id) {
      fetchShift(params?.id);
    }
  }, [params?.id]);

  const fetchClasses = async () => {
    const result = await classesService.find();
    return result;
  }
  const { data: classes } = useQuery(
    'classesShiftForm',
    fetchClasses,
    {
      staleTime: 300000,
      retry: 2,
    }
  );

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

  function handleDays(e) {
    if (e.target.checked) {
      setForm(prev => ({ ...prev, days: [...prev.days, e.target.value] }))
    } else {
      form.days.splice(form.days.indexOf(e.target.value), 1)
      setForm(prev => ({ ...prev, days: form.days }))
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (params?.id) {
      shiftsService
        .update(params?.id, {
          title: form.title,
          id_class: form.id_class,
          description: form.description,
          start_time: form.start_time,
          end_time: form.end_time,
          max_places: form.max_places,
          days: form.days,
        })
        .then((resp) => {
          if (!resp.err) {
            props.setShowToast({ show: true, title: 'Éxito', message: 'La comisión ha sido modificada.', variant: 'success', position: 'top-end' });
            navigate("/admin/shifts");
          } else {
            setErrors(resp.err);
          }
        }).catch((err) => props.setShowToast({ show: true, title: 'Error al modificar la comisión', message: 'Inténtelo de nuevo más tarde', variant: 'danger', position: 'top-end' }));

    } else {
      shiftsService
        .create({
          title: form.title,
          id_class: form.id_class,
          description: form.description,
          start_time: form.start_time,
          end_time: form.end_time,
          max_places: form.max_places,
          days: form.days,
        })
        .then((resp) => {
          if (!resp.err) {
            props.setShowToast({ show: true, title: 'Éxito', message: 'La comisión ha sido creada.', variant: 'success', position: 'top-end' });
            navigate("/admin/shifts");
          } else {
            setErrors(resp.err);
          }
        }).catch((err) => props.setShowToast({ show: true, title: 'Error al crear la comisión', message: 'Inténtelo de nuevo más tarde', variant: 'danger', position: 'top-end' }));
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

  return (
    <div className="container cont-admin-form-shifts">
      <BackBtn props={{ url: '/admin/shifts' }} />
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
                placeholder="¿Cual es el título de la comisión?"
                defaultValue={form.title}
                onChange={handleChange}
                required
              />
              <small className="form-text text-danger">
                {errors.title}
              </small>
            </div>
            <div className="d-flex flex-column w-100">
              <label htmlFor="id_class" className="form-label">Clase</label>
              <select
                className={"form-control w-100 " + (errors.id_class ? 'is-invalid' : '')}
                id="id_class"
                name="id_class"
                type="text"
                defaultValue={form.id_class ?? ""}
                onChange={handleChange}
                required>
                <option value={""} disabled>Elegir clase...</option>
                {classes?.map((x) => (
                  <option key={x._id} value={x._id}>{x.title}</option>
                ))}
              </select>
              <small className="form-text text-danger">
                {errors.id_class}
              </small>
            </div>
            <div className="w-100 w-lg-50">
              <label htmlFor="max_places" className="form-label">Cupo máximo</label>
              <div className="input-group">

                <input
                  className={"form-control  " + (errors.max_places ? 'is-invalid' : '')}
                  id="max_places"
                  name="max_places"
                  type="number"
                  min={0}
                  defaultValue={parseInt(form.max_places)}
                  onChange={handleChange}
                  required
                />
                <div className="input-group-append">
                  <span className="input-group-text">personas</span>
                </div>
              </div>
              <small className="form-text text-danger">
                {errors.max_places}
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
              placeholder="Redactá una descripción detallada sobre la comisión. Podés incluir detalles sobre los artículos a diseñar, materiales, objetivos, etc."
              defaultValue={form.description}
              onChange={handleChange}
              required
            ></textarea>
            <small className="form-text text-danger">
              {errors.description}
            </small>
          </div>
          <div className="d-flex flex-column flex-sm-row gap-3">
            <div className="d-flex flex-column w-100">
              <label htmlFor="days" className="form-label">Días</label>
              <Dropdown className="w-100">
                <Dropdown.Toggle variant="light" className={"form-control w-100 text-start d-flex justify-content-between align-items-center " + (errors.days ? 'is-invalid' : '')}>
                  {form.days.length > 0 ? weekdays.filter(day => form.days.includes(day.id)).map(day => day.name).join(', ') : 'Elegir días'}
                </Dropdown.Toggle>

                <Dropdown.Menu className="p-2 w-100">
                  {weekdays?.map((x) => (
                    <div key={x.id} className="form-check">
                      <input className="form-check-input" type="checkbox" value={x.id} id={x.id} name="days" onChange={e => handleDays(e)} checked={form.days.includes(x.id)} />
                      <label className="form-check-label" htmlFor={x.id}>
                        {x.name}
                      </label>
                    </div>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <small className="form-text text-danger">
                {errors.days}
              </small>
            </div>
            <div className="w-100">
              <label htmlFor="start_time" className="form-label">Hora inicio</label>
              <div className="input-group">
                <input
                  className={"form-control  " + (errors.start_time ? 'is-invalid' : '')}
                  id="start_time"
                  name="start_time"
                  type="string"
                  defaultValue={form.start_time}
                  onChange={handleChange}
                  placeholder="hh:mm"
                  required
                />
                <div className="input-group-append">
                  <span className="input-group-text">hs</span>
                </div>
              </div>
              <small className="form-text text-danger">
                {errors.start_time}
              </small>

            </div>
            <div className="w-100">
              <label htmlFor="end_time" className="form-label">Hora fin</label>
              <div className="input-group">
                <input
                  className={"form-control  " + (errors.end_time ? 'is-invalid' : '')}
                  id="end_time"
                  name="end_time"
                  type="string"
                  defaultValue={form.end_time}
                  onChange={handleChange}
                  placeholder="hh:mm"
                  required
                />
                <div className="input-group-append">
                  <span className="input-group-text">hs</span>
                </div>
              </div>
              <small className="form-text text-danger">
                {errors.end_time}
              </small>

            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-4">
            Guardar comisión
          </button>
        </form>
      }
    </div>
  );
}
