import "../css/Edit.css";

import React, { useEffect, useState } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import * as carritoService from "../../services/carrito.service";

import Loader from "../basics/Loader";
import {Col, Container, Nav, Row} from "react-bootstrap";
import * as productosService from "../../services/productos.service";
import {findByIdUser} from "../../services/carrito.service";



export function HistorialCompras() {
    let navigate = useNavigate();
    const params = useParams();

    const [productosComprados, setProductosComprados] = useState([]);
    const [total, setTotal] = useState(0);
    const [nombre, setNombre] = useState("");
    const [eliminadoCorrectamente, setEliminadoCorrectamente] = useState(false);
    // const [productoEliminado, setProductoEliminado] = useState("");
    const [error, setError] = useState("");



    useEffect(() => {

        const usuarioGuardado = localStorage.getItem('user');

        const usuarioObjeto = JSON.parse(usuarioGuardado);

        setNombre(usuarioObjeto.email);
        console.log(params?.idUsuario);



        traerCarritoUsuario(params?.idUsuario)

    }, []);





    function traerCarritoUsuario(idUsuario) {

        carritoService.findByIdUserFinalizado(idUsuario).then((carrito) => {

            console.log(carrito)
            setProductosComprados(carrito)
            // setTotal(carrito.total);
            // setProductosComprar(carrito.productosComprar)
            //
            // console.log(carrito.total, carrito.productosComprar)
        }).catch((err) => setError(err.message));
    }



    if (productosComprados.length > 0){




        return (


            <main>
                <Container fluid>
                    <Row>

                        <Col md={2} className="d-none d-md-block bg-light sidebar">
                            <div className="sidebar-sticky">
                                <Nav className="flex-column">
                                    <Nav.Link href="/tienda" className="nav-link active">Tienda</Nav.Link>
                                    {/*<Nav.Link href="#" className="nav-link">Carrito de Compras</Nav.Link>*/}
                                    <Nav.Link href="#" className="nav-link">Historial</Nav.Link>
                                </Nav>
                            </div>
                        </Col>


                        <Col md={10} className="ml-md-auto px-md-4">
                            <div className="cont-admin-cursos">
                                <h1>Historial de compras - {nombre}</h1>


                                <ul className="listado-cursos">
                                    {productosComprados.map((productos, index) => (
                                        <li key={`${index}`}>
                                            <p>Compra #{index + 1} / <b> Total:</b> ${productos.total}</p>

                                            <ul>
                                                {productos.productosComprar.map((producto, subIndex) => (
                                                    <li key={`${index}-${subIndex}`}>
                                                        <p><b>{producto.nombre}</b></p>
                                                        <p>${producto.precio}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                                </ul>

                            </div>

                        </Col>

                    </Row>
                </Container>
            </main>


        );

    } else {
        return (


            <main>
                <Container fluid>
                    <Row>

                        <Col md={2} className="d-none d-md-block bg-light sidebar">
                            <div className="sidebar-sticky">
                                <Nav className="flex-column">
                                    <Nav.Link href="/tienda" className="nav-link active">Tienda</Nav.Link>
                                    {/*<Nav.Link href="#" className="nav-link">Carrito de Compras</Nav.Link>*/}
                                    <Nav.Link href="#" className="nav-link">Historial</Nav.Link>
                                </Nav>
                            </div>
                        </Col>


                        <Col md={10} className="ml-md-auto px-md-4">
                            <div>
                                <h1>Historial de compras - {nombre}</h1>
                            </div>

                            <div>
                                <p>No realizaste ninguna compra aún. Hace <a href="/tienda">click aqui</a> para ver los
                                    productos disponibles.</p>
                            </div>

                        </Col>

                    </Row>
                </Container>
            </main>


        );
    }
}
