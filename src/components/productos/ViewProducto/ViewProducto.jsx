import "./ViewProducto.css";


import React, { useEffect, useState, useContext } from "react";
import * as productosService from "../../../services/productos.service";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../App";

export function ViewProducto(params) {
  const value = useContext(AuthContext);

  let navigate = useNavigate();

  const producto = params.producto;

  useEffect(() => {
    if (value.currentUser.role !== 1) {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <div className="row g-0 cont-view-product">
      <div className="col-md-6">
        <img src="..." className="product-image img-fluid rounded-start" alt={producto.descripcion} />
      </div>
      <div className="col-md-6">
        <div className="row g-0">
          <div className="card-body">
            <p className="text-body-secondary">Demora: {producto.demora_producto} días</p>
            <h1 className="card-title">{producto.nombre}</h1>
            <p className="card-price">${producto.precio}</p>
            <p className="negritas">Lo que deberías saber de este producto:</p>
            <p className="card-text">{producto.descripcion}</p>
            <p>Material: <span className="badge text-bg-primary">{producto.material}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
