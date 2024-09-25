import "./CartProduct.css";
import React, { useEffect, useState } from "react";
import * as carritoService from "../../../services/carrito.service";
import { Button } from "react-bootstrap";
import LoaderMini from "../../basics/LoaderMini";

export function CartProduct({ props }) {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const [loadingQuantities, setLoadingQuantities] = useState(false);
  const [quantity, setQuantity] = useState();
  const item = props.item;

  useEffect(() => {
    setQuantity(props.item.quantity);
  }, [props.item.quantity]);

  const handleAddToCart = async (item) => {
    setLoadingQuantities(true);
    try {
      setQuantity(prev => prev + 1);
      await carritoService.addToCart(props.idUser, { id: item._id, quantity: props.item.quantity });
      props.refetch();
    } catch (err) {
      console.error(err);
    }
    setLoadingQuantities(false);
  }

  const handleSubtractToCart = async (item) => {
    setLoadingQuantities(true);
    try {
      // props.item.quantity--
      setQuantity(prev => prev - 1);
      await carritoService.substractToCart(props.idUser, { id: item._id, quantity: props.item.quantity });
      props.refetch();
    } catch (err) {
      console.error(err);
    }
    setLoadingQuantities(false);
  }

  const renderQuantity = () => {
    return loadingQuantities ?
      <LoaderMini className="loader-mini" /> :
      <>
        <Button variant="danger" onClick={() => handleSubtractToCart(props.item)} disabled={props.loadingQuantities}>-</Button>

        {quantity || 0}

        <Button variant="success" onClick={() => handleAddToCart(props.item)
        } disabled={props.loadingQuantities} >+</Button >
      </>
  }

  return (
    <div className="cart-product-cont row g-0 position-relative">
      <div className="img-cont col-2">
        <img src={SERVER_URL + "uploads/" + item.img} className="img-fluid rounded" alt={item.descripcion} />
      </div>
      <div className="col-10">
        <div className="row g-0 h-100">
          <div className="d-flex flex-md-column col-md-9 gx-4 justify-content-between  align-self-justify gap-md-4">
            <a href={`/store/item/${item._id}`} className="stretched-link"><span className="card-title">{item.nombre}</span></a>
            <span className="card-price">${item.precio}</span>
          </div>
          <div className="col-md-3 d-flex flex-column gap-2 align-items-end align-items-md-center justify-content-end">
            <div className="counter-cantidad">
              {renderQuantity()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
