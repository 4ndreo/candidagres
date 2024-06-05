import "./css/Tienda.css";

import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import * as productosService from "../services/productos.service";
import * as userService from "../services/users.service";
import * as carritoService from "../services/carrito.service";
import { AuthContext } from "../App";
import { Navbar, Nav, Container, Row, Col, Button, Offcanvas } from 'react-bootstrap'; // Importa los componentes de Bootstrap

import Loader from "../components/basics/Loader";
import { findById } from "../services/carrito.service";
import * as turnosService from "../services/turnos.service";
import * as inscripcionesService from "../services/inscripciones.service";
import { VerCarrito } from "../components/carrito/VerCarrito";
import { HistorialCompras } from "../components/carrito/HistorialCompras";
import { VerTienda } from "../components/carrito/VerTienda";

export default function Tienda() {

  const location = useLocation();

  const [productos, setProductos] = useState([]);
  const [productosComprar, setProductosComprar] = useState([]);
  const [usuarioId, setUsuarioId] = useState("");
  const [carritoId, setCarritoId] = useState("");
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState();
  const [total, setTotal] = useState(0);
  const [producto, setProducto] = useState([]);
  const [agregadoCorrectamente, setAgregadoCorrectamente] = useState(false);
  const [productoAgregado, setProductoAgregado] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [showProductBreadcrumb, setShowProductBreadcrumb] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  useEffect(() => {
    setUsuarioId(JSON.parse(localStorage.getItem('user'))._id)
    if (location.pathname.includes('/tienda/producto')) {
      setShowProductBreadcrumb(true);
    } else {
      setShowProductBreadcrumb(false);
    }
  }, [location]);

  // function getUserById(usuarioId) {


  //   return new Promise((resolve, reject) => {
  //     carritoService.findByIdUser(usuarioId)
  //       .then((data) => {
  //         resolve(data);
  //       })
  //       .catch((err) => {
  //         reject(err);
  //       });

  //   })

  // }


  // function loadProductos(usuarioId) {
  //   return new Promise((resolve, reject) => {
  //     getProductos().then(() => {
  //       getUserById(usuarioId).then((data) => {
  //         console.log(data)
  //         if (data === null) {
  //           crearCarritoParaUsuario(usuarioId)
  //         } else {
  //           setCarritoId(data._id)
  //           setProductosComprar(data.productosComprar)
  //           console.log(data.productosComprar)
  //           setTotal(data.total)
  //         }
  //       })
  //     })
  //       .catch((err) => {
  //         console.log(err)
  //         reject(err);
  //       });
  //   })
  // }

  // function getProductos() {
  //   return new Promise((resolve, reject) => {
  //     productosService.find()
  //       .then((data) => {
  //         setProductos(data);
  //         resolve();
  //       })
  //       .catch((err) => {
  //         console.log(err)
  //         reject(err);
  //       });

  //   })
  // }


  // function crearCarritoParaUsuario(usuarioId) {
  //   carritoService.create({ usuarioId, total, productosComprar })
  //     .then((data) => {
  //       const idNewCarrito = traerIdNewCarrito(data, usuarioId)
  //       setCarritoId(idNewCarrito)
  //       //todo recibir idCarrito y setearlo para poder mandarlo en el update
  //     })
  //     .catch((err) => {
  //       setError(err.message)
  //     });
  // }


  // function traerIdNewCarrito(carritos, idUsuario) {

  //   const objetoEncontrado = carritos.find(carrito => carrito.usuarioId === idUsuario);
  //   return objetoEncontrado ? objetoEncontrado._id : null;



  // }





  return (
    <main className="container main tienda-cont">
      <Outlet />
    </main>
  );
}
