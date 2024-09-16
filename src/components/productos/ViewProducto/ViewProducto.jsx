import "./ViewProducto.css";
import React, { useContext } from "react";
import * as carritoService from "../../../services/carrito.service";
import { AuthContext } from "../../../App";



export function ViewProducto(params) {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const context = useContext(AuthContext);

  const item = params.producto;

  const handleAddToCart = async () => {
    await carritoService.addToCart(context.currentUser._id, { id: item._id, quantity: 1 });
  }

  return (
    <div className="row g-5 cont-view-product">
      <div className="col-md-6">
        <img src={SERVER_URL + "uploads/" + item.img} className="product-image img-fluid rounded-3" alt={item.descripcion} />
      </div>
      <div className="col-md-6">
        <div className="row g-0 h-100 align-content-between">
          <div>
            <p className="text-body-secondary">Demora estimada: {item.demora_item} días</p>
            <h1 className="card-title">{item.nombre}</h1>
            <p className="card-price">${item.precio}</p>
            <p className="negritas">Lo que deberías saber de este item:</p>
            <p className="card-text">{item.descripcion}</p>
            <p>Material: <span className="badge text-bg-primary">{item.material}</span></p>
          </div>
          <button type="submit" className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2" onClick={handleAddToCart}>
            <span className="pi pi-shopping-cart"></span>
            <span>Agregar al carrito</span>
          </button>
        </div>
      </div>
    </div>
  );
}
