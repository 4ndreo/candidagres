import React, { useEffect, useState, useContext } from "react";
import * as productosService from "../../services/productos.service";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../App";

export function PreviewProducto(params) {
  const value = useContext(AuthContext);

  let navigate = useNavigate();

  const producto = params.producto;
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [demora_producto, setDemora] = useState();
  const [precio, setPrecio] = useState();
  const [material, setMaterial] = useState();
  // const [imagen, setImagen] = useState("");
  const [error, setError] = useState("");
  const [productoEliminar, setProductoEliminar] = useState();
  const [show, setShow] = useState(false);

  const handleShow = (productoSeleccionado) => { setShow(true); setProductoEliminar(productoSeleccionado) };

  useEffect(() => {
    if (value.currentUser.role !== 1) {
      navigate("/", { replace: true });
    }
    console.log("estoy en useEffect", producto)
    setMaterial("Gres")
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    productosService
      .create({ nombre, descripcion, demora_producto, precio, material })
      .then((data) => {
        navigate("/Productos", { replace: true });
      })
      .catch((err) => setError(err.message));
  }

  // function handleSelectedDelete(item) {
  //   setProductoEliminar(item);
  // }
  // const handleImagenChange = (event) => {
  //   const archivo = event.target.files[0];
  //   setImagen(archivo);
  //   console.log(archivo)
  // };

  return (
    <div className="row g-0">
      <div className="col-md-3">
        <img src="..." className="img-fluid rounded-start" alt="..." />
      </div>
      <div className="col-md-9">
        <div className="row g-0">
          <div className="card-body col-md-8">
            <small className="text-body-secondary">Demora: {producto.demora_producto} dias</small>
            <h5 className="card-title">Nombre: {producto.nombre}</h5>
            <p className="card-text">Descripción: {producto.descripcion}</p>
            <p>Material: <span className="badge text-bg-primary">{producto.material}</span></p>
            ${producto.precio}
          </div>
          <div className="col-md-4 d-flex align-items-end justify-content-end">
            <Link to={"producto/id-" + producto._id} className="btn btn-warning btn-editar me-2">
              <span>Editar</span>
            </Link>
            <button
              onClick={() => { params.handleShow(); params.handleSelectedDelete(producto); }}
              className="btn btn-danger btn-eliminar"
              type="button"
              data-toggle="tooltip"
              data-placement="top">
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
