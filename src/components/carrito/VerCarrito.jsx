import "../css/Edit.css";

import React, { useEffect, useState } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import * as carritoService from "../../services/carrito.service";

import Loader from "../basics/Loader";
import {Col, Container, Nav, Row} from "react-bootstrap";
import * as productosService from "../../services/productos.service";



export function VerCarrito() {
    let navigate = useNavigate();
    const params = useParams();

    const [productosComprar, setProductosComprar] = useState([]);
    const [total, setTotal] = useState(0);
    const [nombre, setNombre] = useState("");
    const [eliminadoCorrectamente, setEliminadoCorrectamente] = useState(false);
    // const [productoEliminado, setProductoEliminado] = useState("");
    const [error, setError] = useState("");



    useEffect(() => {

        const usuarioGuardado = localStorage.getItem('user');

        const usuarioObjeto = JSON.parse(usuarioGuardado);

        setNombre(usuarioObjeto.email);
        console.log(usuarioObjeto.email);


        traerCarritoUsuario(params?.idCarrito)

    }, []);


    function traerCarritoUsuario(idCarrito) {

        carritoService.findById(idCarrito).then((carrito) => {

            setTotal(carrito.total);
            setProductosComprar(carrito.productosComprar)

            console.log(carrito.total, carrito.productosComprar)
        }).catch((err) => setError(err.message));
    }

    function handleClick (productoId) {
        console.log(productoId)
        console.log(productosComprar)


        let indice = productosComprar.findIndex(objeto => objeto.id === productoId)

        // Verificar si se encontró el objeto con el ID
        if (indice !== -1) {
            // Eliminar el objeto del array usando splice
            productosComprar.splice(indice, 1);
        }

        let sumaPrecios = productosComprar.reduce((acumulador, objeto) => acumulador + objeto.precio, 0);


        carritoService.updateElimiarProducto(params?.idCarrito, sumaPrecios, productosComprar)
            .then((carrito) => {
                console.log(carrito.productosComprar)
                setProductosComprar(carrito.productosComprar)
                setTotal(carrito.total)
            }).catch((err) => setError(err.message))

        console.log(productosComprar, sumaPrecios)

        setEliminadoCorrectamente(true)

    }


    return (


    <main>
        <Container fluid>
            <Row>

                <Col md={2} className="d-none d-md-block bg-light sidebar">
                    <div className="sidebar-sticky">
                        <Nav className="flex-column">
                            <Nav.Link href="/tienda" className="nav-link active">Tienda</Nav.Link>
                            <Nav.Link href="#" className="nav-link">Carrito de Compras</Nav.Link>
                            <Nav.Link href="#" className="nav-link">Historial</Nav.Link>
                        </Nav>
                    </div>
                </Col>

                <Col md={10} className="ml-md-auto px-md-4">
                    <div className="cont-admin-cursos">
                        <h1>Productos seleccionados de {nombre}</h1>
                        {eliminadoCorrectamente && (
                            <div className="alert alert-danger" role="alert">
                                Producto eliminado de tu carrito
                            </div>
                        )}
                        {/*{agregadoCorrectamente && (*/}
                        {/*    <div className="alert alert-success" role="alert">*/}
                        {/*        Agregado exitosamente*/}
                        {/*    </div>*/}
                        {/*)}*/}

                        <p><b>Total:</b> ${total}</p>



                        <ul className="listado-cursos">
                            {productosComprar
                                // .sort((a, b) => a.nombre.localeCompare(b.nombre))
                                .map((producto, index) => (
                                    <li key={`${index}`}>
                                        {/* Resto del código del mapeo */}
                                        <p><b>{producto.nombre}</b></p>
                                        <p>${producto.precio}</p>
                                        <button
                                            className="btn btn-danger mt-3 me-3"
                                            type="submit"
                                            onClick={() =>handleClick(producto.id)}
                                        >
                                            Quitar
                                        </button>
                                    </li>
                                ))}
                        </ul>


                    </div>

                </Col>
            </Row>
        </Container>
    </main>


        );

}
