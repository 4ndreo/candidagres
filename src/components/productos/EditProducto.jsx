import "../css/Edit.css";
import React, { useEffect, useState, useContext } from "react";
import * as productosService from "../../services/productos.service";
import * as Constants from "../../Constants";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../App";

export function EditProducto({ title }) {
  const value = useContext(AuthContext);

  let navigate = useNavigate();
  const params = useParams();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [demora_producto, setDemora] = useState();
  const [precio, setPrecio] = useState();
  const [material, setMaterial] = useState();
  const [icons, setIcons] = useState([]);
  const [error, setError] = useState("");
  const [imagen, setImagen] = useState(null);
  const [checked, setChecked] = useState({});

  useEffect(() => {
    productosService
      .findById(params?.idProducto)
      .then((producto) => {
        setNombre(producto.nombre);
        setDescripcion(producto.descripcion);
        setDemora(producto.demora_producto);
        setPrecio(producto.precio);
        setMaterial(producto.material);
      })
      .catch((err) => setError(err.message));

    if (value.currentUser.role !== 1) {
      navigate("/", { replace: true });
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    productosService
      .update(params?.idProducto, { nombre, descripcion, demora_producto, precio, material })
      .then((data) => {
        if (imagen) {
          return productosService.uploadImagen(imagen).then((nombreImg) => {
            productosService.update(params?.idProducto, { img: nombreImg }).then((data) => {

            });
          }).then(() => {
            navigate("/Productos", { replace: true });
          });
        }
      });
  }

  const handleImagenChange = (event) => {
    const archivo = event.target.files[0];
    setImagen(archivo);
    console.log(archivo)
  };

  return (
    <main className="container edit-cont">
      <h1>Editar - {title}</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="mb-3">
        </div>
        <div className="mb-3">
          <label className="form-label">Ingrese el nombre del producto</label>
          <input
            type="text"
            defaultValue={nombre}
            required
            onChange={(e) => setNombre(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Ingrese la descripción del producto</label>
          <input
            type="text"
            defaultValue={descripcion}
            required
            onChange={(e) => setDescripcion(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Defina cuantos dias va a tardar</label>
          <input
            type="number"
            defaultValue={demora_producto}
            required
            onChange={(e) => setDemora(parseInt(e.target.value))}
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
        <div className="mb-3">
          <label className="form-label">Defina el material del producto</label>
          <input
            type="text"
            defaultValue={material}
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
          Modificar
        </button>
      </form>
      {error && <p>{error}</p>}
    </main>
  );
}
