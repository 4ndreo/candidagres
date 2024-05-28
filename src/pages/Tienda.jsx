import "./css/Cursos.css";

import React, { useEffect, useState, useContext } from "react";
import { Link, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import * as productosService from "../services/productos.service";
import * as userService from "../services/users.service";
import * as carritoService from "../services/carrito.service";
import { AuthContext } from "../App";
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap'; // Importa los componentes de Bootstrap

import Loader from "../components/basics/Loader";
import { findById } from "../services/carrito.service";
import * as turnosService from "../services/turnos.service";
import * as inscripcionesService from "../services/inscripciones.service";
import { VerCarrito } from "../components/carrito/VerCarrito";
import { HistorialCompras } from "../components/carrito/HistorialCompras";
import { VerTienda } from "../components/carrito/VerTienda";

export default function Tienda() {



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



  useEffect(() => {


    // productosService.find().then((data) => {
    //   setProductos(data);
    //
    // }).catch((err) => {
    //   setError(err.message)
    //   console.log("estoy en el useEffect")
    // });

  }, []);




  //
  // function aplicarProductos(productos){
  //     setProductos(productos)
  // }


  useEffect(() => {

    const usuarioGuardado = localStorage.getItem('user');

    const usuarioObjeto = JSON.parse(usuarioGuardado);

    let usuarioId = usuarioObjeto._id
    setUsuarioId(usuarioObjeto._id)

    loadProductos(usuarioId)





  }, []);

  function getUserById(usuarioId) {


    return new Promise((resolve, reject) => {
      carritoService.findByIdUser(usuarioId)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });

    })

  }


  function loadProductos(usuarioId) {
    return new Promise((resolve, reject) => {
      getProductos().then(() => {
        getUserById(usuarioId).then((data) => {
          console.log(data)
          if (data === null) {
            crearCarritoParaUsuario(usuarioId)
          } else {
            setCarritoId(data._id)
            setProductosComprar(data.productosComprar)
            console.log(data.productosComprar)
            setTotal(data.total)
          }
        })
      })
        .catch((err) => {
          console.log(err)
          reject(err);
        });
    })
  }

  function getProductos() {
    return new Promise((resolve, reject) => {
      productosService.find()
        .then((data) => {
          setProductos(data);
          resolve();
        })
        .catch((err) => {
          console.log(err)
          reject(err);
        });

    })
  }


  function crearCarritoParaUsuario(usuarioId) {
    carritoService.create({ usuarioId, total, productosComprar })
      .then((data) => {
        console.log(data)
        console.log(usuarioId)
        const idNewCarrito = traerIdNewCarrito(data, usuarioId)
        console.log(idNewCarrito);
        setCarritoId(idNewCarrito)
        //todo recibir idCarrito y setearlo para poder mandarlo en el update
      })
      .catch((err) => {
        setError(err.message)
        console.log("estoy en .create carritoService")
      });
  }


  function traerIdNewCarrito(carritos, idUsuario) {

    const objetoEncontrado = carritos.find(carrito => carrito.usuarioId === idUsuario);
    return objetoEncontrado ? objetoEncontrado._id : null;



  }





  function handleClick(productoId) {
    console.log(productos)


    const productoEncontrado = productos.find(producto => producto._id === productoId);

    console.log(productoEncontrado.nombre, productoEncontrado.precio)

    console.log(total + productoEncontrado.precio)
    let newTotal = total + productoEncontrado.precio
    setTotal(newTotal)
    guardarProducto(productoEncontrado.nombre, productoEncontrado.precio, productoEncontrado._id, newTotal)



  }

  function guardarProducto(nombre, precio, idProducto, newTotal) {

    //esto sirve para mostrar el nombre en pantalla del producto agregado con un cartel verde
    setProductoAgregado(nombre)

    let nuevoProducto = { nombre: nombre, precio: precio, id: idProducto }
    setProductosComprar(productosComprar => [...productosComprar, nuevoProducto])

    console.log(newTotal)

    actualizarBaseDeDatos(nuevoProducto, newTotal)


  }

  function actualizarBaseDeDatos(nuevoProducto, totalNuevo) {


    carritoService.update(carritoId, totalNuevo, nuevoProducto)
      .then((msg) => {
        //  console.log(msg)
        if (msg) {
          setAgregadoCorrectamente(msg)
        } else {
          setAgregadoCorrectamente(false)
        }
      })
      .catch((err) => {
        setError(err.message)
        console.log("estoy en el update")
      });

  }


  return (

    <main>
      <Container fluid>
        <Row>

          <Col md={2} className="d-none d-md-block bg-light sidebar">
            <div className="sidebar-sticky">
              <Nav className="flex-column">
                <Link to="/tienda" className="nav-link active">
                  Tienda
                </Link>
                <Link to={`/tienda/carrito/id-${carritoId}`} className="nav-link">
                  Carrito de Compras
                </Link>
                <Link to={`/tienda/carrito/historial/id-${usuarioId}`} className="nav-link">
                  Historial
                </Link>
              </Nav>
            </div>
          </Col>

          <Col md={10} className="ml-md-auto px-md-4">
          <Outlet />
          </Col>


        </Row>
      </Container>
    </main>
  );
}
