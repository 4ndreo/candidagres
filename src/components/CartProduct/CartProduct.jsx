import "./CartProduct.css";
import React, { useEffect, useState } from "react";
import * as cartsService from "../../services/carts.service";
import { Button } from "react-bootstrap";

// Cloudinary
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { defaultImage } from "@cloudinary/url-gen/actions/delivery";

export function CartProduct({ props }) {
  const [quantity, setQuantity] = useState();
  const item = props.item;

  useEffect(() => {
    setQuantity(props.item.quantity);
  }, [props.item.quantity]);

  const handleAddToCart = async (item) => {
    try {
      setQuantity(prev => prev + 1);
      await cartsService.addToCart(props.idUser, { id: item._id, quantity: props.item.quantity });
      props.refetch();
    } catch (err) {
      props.setShowToast({ show: true, title: 'Error al agregar al carrito', message: 'Inténtelo de nuevo más tarde', variant: 'danger', position: 'top-end' });
      setQuantity(prev => prev - 1);
      console.error(err);
    }
  }

  const handleSubtractToCart = async (item) => {
    try {
      setQuantity(prev => prev - 1);
      await cartsService.substractToCart(props.idUser, { id: item._id, quantity: props.item.quantity });
      props.refetch();
    } catch (err) {
      console.error(err);
    }
  }

  const renderQuantity = () => {
    return (
      <>
        <Button variant="danger" onClick={() => handleSubtractToCart(props.item)}>-</Button>
        {quantity || 0}
        <Button variant="success" onClick={() => handleAddToCart(props.item)}>+</Button >
      </>)
  }

  const renderImage = (item) => {
    const cld = new Cloudinary({ cloud: { cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME } });
    const img = cld
      .image(item?.img ? `products/${item?.img}` : 'placeholder-image')
      .format('auto')
      .quality('auto')
      .resize(auto().gravity(autoGravity()))
      .delivery(defaultImage("placeholder-image.jpg"));
    return (
      <AdvancedImage cldImg={img} className="img-fluid rounded" alt={item?.description} />
    )
  }
  if (quantity < 1) return null
  return (
    <div className="cart-product-cont row g-0 position-relative">
      <div className="img-cont col-2">
        {renderImage(item)}
        {/* <img src={SERVER_URL + "uploads/" + item.img} className="img-fluid rounded" alt={item.description} /> */}
      </div>
      <div className="col-10">
        <div className="row g-0 h-100">
          <div className="d-flex flex-md-column col-md-9 gx-4 justify-content-between  align-self-justify gap-md-4">
            <a href={`/store/item/${item._id}`} className="stretched-link"><span className="card-title">{item.title}</span></a>
            <span className="card-price">${item.price}</span>
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
