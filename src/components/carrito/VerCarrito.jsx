import "../css/Edit.css";

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as carritoService from "../../services/carrito.service";

import Loader from "../basics/Loader";
import { Col, Container, Nav, Row, Button, Modal, ListGroup } from "react-bootstrap";
import * as productosService from "../../services/productos.service";



export function VerCarrito() {
    let navigate = useNavigate();
    const params = useParams();

    const [productosComprar, setProductosComprar] = useState([]);
    const [total, setTotal] = useState(0);
    const [nombre, setNombre] = useState("");
    const [usuarioId, setUsuarioId] = useState("");
    const [carritoId, setCarritoId] = useState("");
    const [eliminadoCorrectamente, setEliminadoCorrectamente] = useState(false);
    // const [productoEliminado, setProductoEliminado] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [error, setError] = useState("");



    useEffect(() => {

        const usuarioGuardado = localStorage.getItem('user');

        const usuarioObjeto = JSON.parse(usuarioGuardado);

        setNombre(usuarioObjeto.email);
        setUsuarioId(params.idUsuario);
        setCarritoId(params?.idCarrito);
        console.log(params.idUsuario);


        traerCarritoUsuario(params?.idCarrito)

    }, []);


    function getUserById(usuarioId) {


        return new Promise((resolve, reject) => {
          carritoService.findByIdUser(params.idUsuario)
            .then((data) => {
              resolve(data);
            })
            .catch((err) => {
              reject(err);
            });
    
        })
    
      }
      function crearCarritoParaUsuario(usuarioId) {
        carritoService.create({ usuarioId, total, productosComprar })
          .then((data) => {
            const idNewCarrito = traerIdNewCarrito(data, usuarioId)
            setCarritoId(idNewCarrito)
            //todo recibir idCarrito y setearlo para poder mandarlo en el update
          })
          .catch((err) => {
            setError(err.message)
          });
      }
    
    
      function traerIdNewCarrito(carritos, idUsuario) {
    
        const objetoEncontrado = carritos.find(carrito => carrito.usuarioId === params.idUsuario);
        return objetoEncontrado ? objetoEncontrado._id : null;
    
    
    
      }
    function traerCarritoUsuario(idCarrito) {


        getUserById(usuarioId).then((data) => {
            console.log('data', data)
            if (data === null) {
              crearCarritoParaUsuario(params.idUsuario)
            } else {
              setCarritoId(data._id)
              setProductosComprar(data.productosComprar)
              console.log(data.productosComprar)
              setTotal(data.total)
            }
          })
        // carritoService.findById(idCarrito).then((carrito) => {

        //     setTotal(carrito.total);
        //     setProductosComprar(carrito.productosComprar)

        //     console.log(carrito.total, carrito.productosComprar)
        // }).catch((err) => setError(err.message));
    }

    function handleClick(productoId) {

        const confirmarQuitar = window.confirm('¿Estás seguro de que quieres quitar este producto?');
        console.log(productoId)
        console.log(productosComprar)

        if (confirmarQuitar) {
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



    }


    function handleClickFinalizar() {
        console.log("finalizar compra")
        setShowModal(true);

    }

    function handleConfirmar() {
        carritoService.remove(carritoId).then((carrito) => {

            setProductosComprar([])
            setTotal(0)
            console.log(carrito)
        }).catch((err) => setError(err.message));
        setShowModal(false);
        setShowSuccessModal(true);
    }


    function handleCancelar() {
        setShowModal(false);
        setShowModal(false);
    }

    function handleAceptarSuccess() {
        setShowSuccessModal(false);
    }


    if (productosComprar.length > 0) {

        return (

            <div className="cont-admin-cursos">
                <h1>Productos seleccionados de {nombre}</h1>
                {eliminadoCorrectamente && (
                    <div className="alert alert-danger" role="alert">
                        Producto eliminado de tu carrito
                    </div>
                )}

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
                                    onClick={() => handleClick(producto.id)}
                                >
                                    Quitar
                                </button>
                            </li>
                        ))}
                </ul>


                <button
                    className="btn btn-success mt-3 me-3"
                    type="submit"
                    onClick={() => handleClickFinalizar()}
                >Finalizar Compra
                </button>
                <Modal show={showModal} onHide={handleCancelar}>
                    <Modal.Header closeButton>
                        <Modal.Title className="p-2">Finalizar Compra</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>¿Estás seguro de que quieres finalizar la compra?</p>
                        <p>Productos a comprar: <b>Total: {total}</b></p>
                        <ListGroup>
                            {productosComprar.map((producto, index) => (
                                <ListGroup.Item key={`${producto.id}-${index}`}>
                                    {producto.nombre} x ${producto.precio}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCancelar}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleConfirmar}>
                            Confirmar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showSuccessModal} onHide={handleAceptarSuccess}>
                    <Modal.Header closeButton>
                        <Modal.Title className="p-2">Operación Realizada con Éxito</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>La compra se ha finalizado con éxito.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleAceptarSuccess}>
                            Aceptar
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
            //         </Row>
            //     </Container>
            // </main>


        );

    } else {
        return (
            <Loader></Loader>
        )
    }
    // else
    // {
    //     return (
    //         <main>

    //             <Container fluid>
    //                 <Row>

    //                     <Col md={2} className="d-none d-md-block bg-light sidebar">
    //                         <div className="sidebar-sticky">
    //                             <Nav className="flex-column">
    //                                 <Nav.Link href="/tienda" className="nav-link">Tienda</Nav.Link>
    //                                 <Nav.Link href={`/carrito/id-${usuarioId}`} className="nav-link active">Carrito de Compras</Nav.Link>
    //                                 <Nav.Link href={`/carrito/historial/id-${usuarioId}`} className="nav-link">Historial</Nav.Link>
    //                             </Nav>
    //                         </div>
    //                     </Col>

    //                     <Col md={10} className="ml-md-auto px-md-4">
    //                         <div>
    //                             <h1>Productos seleccionados de {nombre}</h1>
    //                             <p><b>Total:</b> ${total}</p>
    //                         </div>

    //                         <div>
    //                             <p>No tenes productos en el carrito. Hace <a href="/tienda">click aqui</a> para ver los
    //                                 productos disponibles.</p>
    //                         </div>

    //                     </Col>
    //                 </Row>
    //             </Container>

    //         </main>
    //     )
    // }
}
