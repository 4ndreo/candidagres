import React, { useEffect, useState, useContext } from "react";
import * as cursosService from "../../services/cursos.service";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../App";

export function CreateCurso({ title }) {
  const value = useContext(AuthContext);

  let navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [duracion, setDuracion] = useState();
  const [precio, setPrecio] = useState();
  const [error, setError] = useState("");

  useEffect(() => {
    if (value.currentUser.role !== 1) {
      navigate("/", { replace: true });
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    cursosService
      .create({ nombre, descripcion, duracion })
      .then((data) => {
        navigate("/panel/cursos", { replace: true });
      })
      .catch((err) => setError(err.message));
  }

  return (
    <main className="container edit-cont">
      <h1>Crear - {title}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Ingrese el nombre del curso</label>
          <input
            type="text"
            required
            onChange={(e) => setNombre(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Ingrese la descripción del curso</label>
          <input
            type="text"
            required
            onChange={(e) => setDescripcion(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">A que hora comienza el curso</label>
          <input
            type="number"
            defaultValue={0}
            required
            onChange={(e) => setDuracion(parseInt(e.target.value))}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Cuanto cuesta el curso</label>
          <input
            type="number"
            defaultValue={0}
            required
            onChange={(e) => setDuracion(parseInt(e.target.value))}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Crear
        </button>
      </form>
    </main>
  );
}
