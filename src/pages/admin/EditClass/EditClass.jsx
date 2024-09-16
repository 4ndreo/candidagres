import React, { useEffect, useState, useContext } from "react";
import * as cursosService from "../../../services/cursos.service";
import * as Constants from "../../../Constants";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../App";

export function EditClass({ title }) {
  const value = useContext(AuthContext);

  let navigate = useNavigate();
  const params = useParams();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [profesor, setProfesor] = useState("");
  const [precio, setPrecio] = useState();
  const [icons, setIcons] = useState([]);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState({});

  useEffect(() => {
    cursosService
      .findById(params?.idCurso)
      .then((curso) => {
        setNombre(curso.nombre);
        setDescripcion(curso.descripcion);
        setPrecio(curso.precio);
        setProfesor(curso.profesor);
      })
      .catch((err) => setError(err.message));

    if (value.currentUser.role !== 1) {
      navigate("/", { replace: true });
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    cursosService
      .update(params?.idCurso, { nombre, descripcion, precio, profesor })
      .then((data) => {
        navigate("/panel/cursos", { replace: true });
      });
  }

  return (
    <main className="container edit-cont">
      <h1>Editar - {title}</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="mb-3">
          <label className="form-label">Ingrese el nombre de la clase</label>
          <input
            type="text"
            defaultValue={nombre}
            required
            onChange={(e) => setNombre(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Ingrese la descripción de la clase</label>
          <input
            type="text"
            defaultValue={descripcion}
            required
            onChange={(e) => setDescripcion(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Quien es el profesor asignado</label>
          <input
            type="text"
            defaultValue={profesor}
            required
            onChange={(e) => setProfesor(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Cuanto cuesta la clase</label>
          <input
              type="number"
              defaultValue={precio}
              required
              onChange={(e) => setPrecio(parseInt(e.target.value))}
              className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Modificar
        </button>
      </form>
      {error && <p>{error}</p>}
    </main>
  );
}
