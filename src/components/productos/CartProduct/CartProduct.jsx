import "./CartProduct.css";
import React, { useEffect, useState, useContext } from "react";
import * as productosService from "../../../services/productos.service";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import LoaderMini from "../../basics/LoaderMini";

export function CartProduct(params) {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;


  let navigate = useNavigate();

  const producto = params.producto;


  return (
    <div className="cart-product-cont row g-0 position-relative">
      <div className="img-cont col-2">
        <img src={SERVER_URL + "uploads/" + producto.img} className="img-fluid rounded" alt={producto.descripcion} />
      </div>
      <div className="col-10">
        <div className="row g-0 h-100">
          <div className="d-flex flex-md-column col-md-8 gx-4 justify-content-between  align-self-justify gap-md-4">            
            <a href={`/tienda/producto/id-${producto._id}`} className="stretched-link"><span className="card-title">{producto.nombre}</span></a>
            <span className="card-price">${producto.precio}</span>
          </div>
          <div className="col-md-4 d-flex flex-column gap-2 align-items-end align-items-md-center justify-content-end">

            <div className="counter-cantidad btn-carrito">
              <div>
                {params.loadingQuantities ? <LoaderMini className="loader-mini" /> :
                  <>
                    <Button variant="danger" onClick={() => params.handleSubstractItemToCart(params.producto._id)} disabled={params.loadingQuantities}>-</Button>

                    {params.checkQuantity(params.producto._id) || 0}

                    <Button variant="success" onClick={() => params.handleAddItemToCart(params.producto._id)} disabled={params.loadingQuantities}>+</Button>
                  </>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
