import "./css/Cursos.css";

import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as productosService from "../services/productos.service";
import { AuthContext } from "../App";
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap'; // Importa los componentes de Bootstrap

import Loader from "../components/basics/Loader";

export default function Tienda() {
  const [productos, setProductos] = useState([]);

  const value = useContext(AuthContext);

  let navigate = useNavigate();

  useEffect(() => {
    if (value.currentUser.role !== 1) {
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(() => {
    productosService.find().then((data) => {
      setProductos(data);
      console.log(data)
    });
  }, []);


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
                  <ul className="listado-cursos">
                    {productos.map((producto) => {
                      return (
                          <li key={producto._id}>
                            <img
                                src={producto.imagen}
                                alt={producto.descripcion}
                                style={{ maxWidth: '100px', maxHeight: '100px' }}
                            />
                            <p><b>{producto.nombre}</b></p>
                            <p>Precio: ${producto.precio}</p>
                            <p>Demora aproximada: {producto.demora_producto} días</p>
                            <button className="btn btn-primary mt-3 me-3" type="submit">Agregar</button>
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
          <h1>No existen productos en la Tienda</h1>
        </main>
    )
  }
}
