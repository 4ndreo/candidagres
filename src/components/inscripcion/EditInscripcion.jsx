import "../css/Edit.css";
import React, { useEffect, useState, useContext } from "react";
import * as inscripcionesService from "../../services/inscripciones.service";
import * as Constants from "../../Constants";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../App";

export function EditInscripcion({ title }) {
  const value = useContext(AuthContext);

  let navigate = useNavigate();

  const [monto, setMonto] = useState();
  const [formaPago, setFormaPago] = useState("");
  const [nombre, setNombre] = useState("");
  const [icons, setIcons] = useState([]);
  const [error, setError] = useState("");
  const params = useParams();

  useEffect(() => {
    inscripcionesService
      .findById(params?.idInscripcion)
      .then((inscripcion) => {
        setMonto(inscripcion.monto);
        setFormaPago(inscripcion.formaPago);
        setNombre(inscripcion.nombre);
        setFormaPago("error");
      })
      .catch((err) => setError(err.message));

    if (value.currentUser.role !== 1) {
      navigate("/", { replace: true });
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(monto);
    if (formaPago !== "error") {
      inscripcionesService
        .update(params?.idInscripcion, { monto, formaPago })
        .then((data) => {
          console.log(monto);
          navigate("/inscripciones", { replace: true });
        });
    } else {
      window.alert("Tenes que seleccionar una forma de pago");
    }
  }

  return (
    <main className="container edit-cont">
      <h1>Editar - {title}</h1>
      <h2>Alumno: {nombre}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="cursos">Como desea pagar</label>
          <select
            name="cursos"
            id="cursos"
            form="cursosForm"
            onChange={(e) => setFormaPago(e.target.value)}
            required
          >
            <option value="error"> Selecciona el turno...-</option>
            <option value="transferencia"> Transferencia </option>
            <option value="efectivo"> Efectivo</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Cuanto cuesta el taller</label>
          <input
            type="number"
            defaultValue={monto}
            required
            onChange={(e) => setMonto(e.target.value)}
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
