import "./css/Cursos.css";

import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as productosService from "../services/productos.service";
import * as userService from "../services/users.service";
import * as carritoService from "../services/carrito.service";
import { AuthContext } from "../App";
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap'; // Importa los componentes de Bootstrap

import Loader from "../components/basics/Loader";
import {findById} from "../services/carrito.service";

export default function Tienda() {
  const [productos, setProductos] = useState([]);
  const [productosComprar, setProductosComprar] = useState([]);
  const [usuarioId, setUsuarioId] = useState("");
  const [carritoId, setCarritoId] = useState("");
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState();
  const [total, setTotal] = useState();
  const [producto, setProducto] = useState([]);
  const [agregadoCorrectamente, setAgregadoCorrectamente] = useState(false);
  const [error, setError] = useState("");



  useEffect(() => {
    productosService.find().then((data) => {
      setProductos(data);
     // console.log(data)
    });

    console.log(agregadoCorrectamente)
  }, []);


  useEffect(() => {

    const usuarioGuardado = localStorage.getItem('user');

    const usuarioObjeto = JSON.parse(usuarioGuardado);

    let usuarioId = usuarioObjeto._id
    setUsuarioId(usuarioObjeto._id)

    carritoService.find().then((data) => {
      console.log(data)
      buscarCarritoParaId(data, usuarioObjeto._id)

      if(!buscarCarritoParaId(data, usuarioObjeto._id)){

      //  console.log(buscarCarritoParaId(data, usuarioObjeto._id), usuarioId, total, productosComprar)
        carritoService.create({usuarioId, total, productosComprar})
            .then()
            .catch((err) => setError(err.message));
        setTotal(0)
      } else {
        let objetoFiltrado = data.find(objeto => objeto.usuarioId === usuarioObjeto._id);

        // Verificar si se encontró el objeto
        if (objetoFiltrado) {
          // Obtener el valor del campo 'total' del objeto encontrado
         setTotal(objetoFiltrado.total);

        }
      }
      // console.log(data[0].total)
      // console.log(buscarCarritoParaId(data, usuarioObjeto._id))

    });

  }, []);






  function handleClick (productoId) {
    console.log(productoId)

    productosService.findById(productoId).then((data) => {

      // setProducto(data)
      // console.log(data)
      guardarProducto(data)
    });


  }

  function guardarProducto (producto){


    let detallesProducto = [{nombre: producto.nombre, precio: producto.precio}]
    let totalNuevo = total + producto.precio

    console.log("Detalles del producto",detallesProducto,
                "Total",total,
                "Total nuevo",totalNuevo)
    // setTotal(totalNuevo)

    carritoService.find().then((data) => {
      console.log(data)
      if(buscarCarritoParaId(data, usuarioId)){
        console.log("Existe un carrito abierto para este usuario")
        // if (total !== null && total !== undefined) {
        console.log(carritoId, totalNuevo, detallesProducto)
          carritoService.update(carritoId, totalNuevo, detallesProducto)
              .then((msg) => {
                console.log(msg)
                if(msg){
                  setAgregadoCorrectamente(msg)
                } else {
                  setAgregadoCorrectamente(false)
                }
              })
              .catch((err) => setError(err.message));
        // }
      } else {
        console.log("No existe un carrito abierto para este usuario")

      }
    });
    console.log("Producto recibido:", producto._id)

  }


  function buscarCarritoParaId(carritoEnLaBase, userId) {
    console.log('Datos de entrada:', carritoEnLaBase, userId);

    // Filtra los carritos abiertos en la base y corrobora (si hay) que sean del usuario actual
    const carritosAbiertos = carritoEnLaBase.filter(producto => !producto.deleted && producto.usuarioId === userId);

    console.log('Carritos abiertos para este usuario:', carritosAbiertos);

    if (carritosAbiertos.length > 0) {
      console.log('Se encontraron carritos abiertos para este usuario', userId, ':', carritosAbiertos);

      // Recorremos el carrito abierto del usuario
      carritosAbiertos.forEach(carrito => {
        console.log('ID del carrito:', carrito._id);
        setCarritoId(carrito._id)
        //setTotal(carrito.total)

      });

      return true;
    } else {
      console.log('No se encontraron carritos abiertos para este usuario', userId);
      setTotal(0)
      return false;
    }
  }



  if (productos.length > 0) {

    return (

        <main>
          <Container fluid>
            <Row>

              <Col md={2} className="d-none d-md-block bg-light sidebar">
                <div className="sidebar-sticky">
                  <Nav className="flex-column">
                    <Nav.Link href="#" className="nav-link active">Tienda</Nav.Link>
                    <Nav.Link href="#" className="nav-link">Carrito de Compras</Nav.Link>
                    <Nav.Link href="#" className="nav-link">Historial</Nav.Link>
                  </Nav>
                </div>
              </Col>

              <Col md={10} className="ml-md-auto px-md-4">
                <div className="cont-admin-cursos">
                  <h1>Tienda</h1>
                  {agregadoCorrectamente && (
                      <div className="alert alert-success" role="alert">
                        Agregado exitosamente
                      </div>
                  )}
                  {/*<p>Total: {total}</p>*/}
                  <ul className="listado-cursos">
                    {productos.map((producto) => {
                      return (
                          <li key={producto._id}>
                            {/*<img*/}
                            {/*    src={producto.imagen}*/}
                            {/*    alt={producto.descripcion}*/}
                            {/*    style={{ maxWidth: '100px', maxHeight: '100px' }}*/}
                            {/*/>*/}
                            <p><b>{producto.nombre}</b></p>
                            <p>Precio: ${producto.precio}</p>
                            <p>Demora aproximada: {producto.demora_producto} días</p>
                            <button
                                className="btn btn-primary mt-3 me-3"
                                type="submit"
                                onClick={() =>handleClick(producto._id)}
                            >
                              Agregar
                            </button>
                            <Link
                                to={"producto/id-" + producto._id}
                                className="btn btn-warning mt-3 "
                            >
                              Ver
                            </Link>
                          </li>
                      );
                    })}
                  </ul>
                </div>

              </Col>
            </Row>
          </Container>
        </main>
    );
  } else
  {
    return (
        <main>
          <Loader></Loader>
        </main>
    )
  }
}
