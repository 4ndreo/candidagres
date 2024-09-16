import "./CartProduct.css";
import React, { useState } from "react";
import * as carritoService from "../../../services/carrito.service";
import { Button } from "react-bootstrap";
import LoaderMini from "../../basics/LoaderMini";

export function CartProduct(params) {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const [loadingQuantities, setLoadingQuantities] = useState(false);


  const handleAddToCart = async (item) => {
    setLoadingQuantities(true);
    try {
      params.producto.quantity++
      await carritoService.addToCart(params.idUser, { id: item._id, quantity: params.producto.quantity });
    } catch (err) {
      console.error(err);
    }
    setLoadingQuantities(false);
  }

  const handleSubtractToCart = async (item) => {
    setLoadingQuantities(true);
    try {
      params.producto.quantity--
      await carritoService.substractToCart(params.idUser, { id: item._id, quantity: params.producto.quantity });
    } catch (err) {
      console.error(err);
    }
    setLoadingQuantities(false);
  }

  const renderQuantity = () => {
    console.log('preferenceId', params.editing);
    if (!params.editing || params.editing === undefined) {
      return (
        <div>
          <Button variant="danger" onClick={() => handleSubtractToCart(params.producto)} disabled={params.loadingQuantities}>-</Button>

          {params.producto.quantity || 0}

          <Button  variant="success" onClick={() => handleAddToCart(params.producto)
          } disabled={params.loadingQuantities} >+</Button >

        </div>
      )
    }

    return <small>Cantidad: {params.producto.quantity || 0}</small>
  }

  const producto = params.producto;

  return (
    <div className="cart-product-cont row g-0 position-relative">
      <div className="img-cont col-2">
        <img src={SERVER_URL + "uploads/" + producto.img} className="img-fluid rounded" alt={producto.descripcion} />
      </div>
      <div className="col-10">
        <div className="row g-0 h-100">
          <div className="d-flex flex-md-column col-md-8 gx-4 justify-content-between  align-self-justify gap-md-4">
            <a href={`/store/producto/id-${producto._id}`} className="stretched-link"><span className="card-title">{producto.nombre}</span></a>
            <span className="card-price">${producto.precio}</span>
          </div>
          <div className="col-md-4 d-flex flex-column gap-2 align-items-end align-items-md-center justify-content-end">

            <div className="counter-cantidad">
              <div>
                {loadingQuantities ? <LoaderMini className="loader-mini" /> : renderQuantity()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
