import "./StoreProduct.css";
import React, { useState } from "react";
import * as carritoService from "../../../services/carrito.service";
import { Link } from "react-router-dom";

import { Card } from "react-bootstrap";

import ImagePlaceholder from "../../../img/placeholder-image.jpg";

export function StoreProduct({ props }) {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const item = props.item;


  return (

    <Card className="store-product-cont">
      <div className="card-img-cont">

        <Card.Img className="card-img" variant="top" src={item.img ? SERVER_URL + "uploads/" + item.img : ImagePlaceholder} />
      </div>
      <Card.Body>
        <div className="d-flex flex-column justify-content-between ">
          <Link to={`/store/item/${item._id}`} className="stretched-link"><span className="card-title">{item.nombre}</span></Link>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-md-3">


            {/* <Card.Text className="card-material"> */}
              <span className="badge text-bg-primary card-material">{item.material}</span>
            {/* </Card.Text> */}
            <Card.Text className="card-price">
              ${item.precio}
            </Card.Text>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
