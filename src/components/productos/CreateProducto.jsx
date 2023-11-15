import React, { useEffect, useState, useContext } from "react";
import * as productosService from "../../services/productos.service";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../App";

export function CreateProducto({ title }) {
  const value = useContext(AuthContext);

  let navigate = useNavigate();

  const [descripcion, setDescripcion] = useState("");
  const [demora_producto, setDemora] = useState();
  const [precio, setPrecio] = useState();
  const [material, setMaterial] = useState();
  const [error, setError] = useState("");

  useEffect(() => {
    if (value.currentUser.role !== 1) {
      navigate("/", { replace: true });
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    productosService
      .create({ descripcion, demora_producto, precio, material })
      .then((data) => {
        navigate("/Productos", { replace: true });
      })
      .catch((err) => setError(err.message));
  }

  return (
    <main className="container edit-cont">
      <h1>Crear - {title}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Ingrese la descripción de la clase</label>
          <input
            type="text"
            required
            onChange={(e) => setDescripcion(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">¿En cuantos dias estimas la entrega?</label>
          <input
            type="number"
            defaultValue={0}
            required
            onChange={(e) => setDemora(parseInt(e.target.value))}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">¿Cuanto cuesta el producto?</label>
          <input
            type="number"
            defaultValue={0}
            required
            onChange={(e) => setPrecio(parseInt(e.target.value))}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">¿De que material esta hecho?</label>
          <input
            type="text"
            required
            onChange={(e) => setMaterial(e.target.value)}
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
