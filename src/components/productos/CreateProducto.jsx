import React, { useEffect, useState, useContext } from "react";
import * as productosService from "../../services/productos.service";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../App";
import { uploadImagen } from "../../services/productos.service";

export function CreateProducto({ title }) {
  const value = useContext(AuthContext);

  let navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [demora_producto, setDemora] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [material, setMaterial] = useState('');
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (value.currentUser.role !== 1) {
      navigate("/", { replace: true });
    }
    setMaterial("Gres")
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    productosService
      .create({ nombre, descripcion, demora_producto, precio, material })
      .then((producto) => {
        console.log('produicto', producto)
        if (imagen) {
          return productosService.uploadImagen(imagen).then((nombreImg) => {
            productosService.update(producto._id, { img: nombreImg });
          });
        }
      })
      .then(() => {
        navigate("/Productos", { replace: true });
      })
      .catch((err) => setError(err.message));
  }

  const handleImagenChange = (event) => {
    const archivo = event.target.files[0];
    setImagen(archivo);
    console.log(archivo)
  };

  return (
    <main className="container edit-cont">
      <h1>Crear - {title}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre del producto</label>
          <input
            type="text"
            required
            onChange={(e) => setNombre(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Ingrese una breve descripción del producto</label>
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
            value={material}
            required
            onChange={(e) => setMaterial(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Subir Imagen:</label>
          <input
            type="file"
            onChange={handleImagenChange}
            className="form-control"
            name="imagenProducto"
            id="imagenProducto"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Crear
        </button>
      </form>
    </main>
  );
}
