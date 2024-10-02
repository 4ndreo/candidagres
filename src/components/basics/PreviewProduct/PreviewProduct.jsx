import "./PreviewProduct.css";
import React, { useEffect, useState, useContext } from "react";
import * as productosService from "../../../services/productos.service";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../App";

export function PreviewProduct(params) {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const value = useContext(AuthContext);

  let navigate = useNavigate();

  const producto = params.producto;

  useEffect(() => {
    if (value.currentUser.role !== 1) {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <div className="preview-productos-cont row g-0">
      <div className="img-cont col-md-3">
        <img src={SERVER_URL + "uploads/" + producto.img} className="img-fluid rounded" alt={producto.descripcion} />
      </div>
      <div className="col-md-9">
        <div className="row g-0 h-100">
          <div className="card-body col-md-8">
            <small className="text-body-secondary">Demora: {producto.demora_producto} días</small>
            <h5 className="card-title">Nombre: {producto.nombre}</h5>
            <p className="card-text">Descripción: {producto.descripcion}</p>
            <p>Material: <span className="badge text-bg-primary">{producto.material}</span></p>
            ${producto.precio}
          </div>
          <div className="col-md-4 d-flex gap-2 align-items-end justify-content-end">
            <Link to={"producto/id-" + producto._id} className="btn btn-warning btn-icon">
              <span className="pi pi-pen-to-square"></span>Editar
            </Link>
            <button
              onClick={() => { params.handleShow(); params.handleSelectedDelete(producto); }}
              className="btn btn-danger btn-icon"
              type="button"
              data-toggle="tooltip"
              data-placement="top">
              <span className="pi pi-trash"></span>Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
