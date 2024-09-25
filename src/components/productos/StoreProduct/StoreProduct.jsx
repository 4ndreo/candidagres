import "./StoreProduct.css";
import React, { useState } from "react";
import * as carritoService from "../../../services/carrito.service";
import { Link } from "react-router-dom";

import {  Card } from "react-bootstrap";

import ImagePlaceholder from "../../../img/placeholder-image.jpg";

export function StoreProduct({ props }) {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const item = props.item;


  return (
    <Card className="store-product-cont">
      <Card.Img className="card-img" variant="top" src={item.img ? SERVER_URL + "uploads/" + item.img : ImagePlaceholder} />
      <Card.Body>
      <Link to={`/store/item/${item._id}`} className="stretched-link"><span className="card-title">{item.nombre}</span></Link>
        <Card.Text className="card-price">
          ${item.precio}
        </Card.Text>
        <Card.Text>
          {item.descripcion}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
