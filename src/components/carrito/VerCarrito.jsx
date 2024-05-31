import "./VerTienda.css";

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as carritoService from "../../services/carrito.service";

import Loader from "../basics/Loader";
import { Col, Container, Nav, Row, Button, Modal, ListGroup, Card } from "react-bootstrap";
import * as productosService from "../../services/productos.service";

import ImagePlaceholder from "../../img/placeholder-image.jpg";




export function VerCarrito() {
    let navigate = useNavigate();
    const params = useParams();

    const [productosComprar, setProductosComprar] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [total, setTotal] = useState(0);
    const [nombre, setNombre] = useState("");
    const [usuarioId, setUsuarioId] = useState("");
    const [carritoId, setCarritoId] = useState("");
    const [eliminadoCorrectamente, setEliminadoCorrectamente] = useState(false);

    const [agregadoError, setAgregadoError] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [error, setError] = useState("");



    useEffect(() => {


        setUsuarioId((JSON.parse(localStorage.getItem('user')))._id)
        loadCarrito((JSON.parse(localStorage.getItem('user')))._id)
    }, []);


    function getCarritobyIdUser(usuarioId) {
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

    function loadCarrito(usuarioId) {
        return new Promise((resolve, reject) => {
            getCarritobyIdUser(usuarioId).then((data) => {
                if (data === null) {
                    crearCarritoParaUsuario(usuarioId)
                } else {
                    setCarrito(data)
                    localStorage.setItem("carrito", JSON.stringify(data))
                }
            })
                .catch((err) => {
                    console.error(err)
                    reject(err);
                });
        })
    }
    function crearCarritoParaUsuario(usuarioId) {
        carritoService.create(usuarioId)
            .then((data) => {
                // const idNewCarrito = traerIdNewCarrito(data, usuarioId)
                setCarrito(data)
                localStorage.setItem("carrito", JSON.stringify(data))
                //todo recibir idCarrito y setearlo para poder mandarlo en el update
            })
            .catch((err) => {
                setError(err.message)
            });
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


    function handleAddItemToCart(productoId) {
        guardarProducto(productoId, 'add')
        actualizarCarrito(carrito)
    }

    function handleSubstractItemToCart(productoId) {
        guardarProducto(productoId, 'substract')
        actualizarCarrito(carrito)
    }

    function guardarProducto(productoId, operacion) {
        let nuevoProducto = true;

        carrito.productos.forEach((producto, index) => {
            if (producto.id === productoId) {
                nuevoProducto = false;
                operacion === 'add' ? carrito.productos[index].cantidad++ : carrito.productos[index].cantidad--;
                if (carrito.productos[index].cantidad <= 0) {
                    carrito.productos.splice(index, 1);
                }
            }
        })
        if (nuevoProducto && operacion === 'add') {
            carrito.productos.push({ id: productoId, cantidad: 1 })
        }
    }

    function checkQuantity(productoId) {
        // console.log(productoId)
        return carrito.productos.find(producto => producto.id === productoId)?.cantidad
    }

    function actualizarCarrito(carrito) {
        localStorage.setItem("carrito", JSON.stringify(carrito))
        carritoService.update(carrito)
            .then((response) => {
                if (response) {
                    setCarrito({ ...carrito })
                } else {
                    setAgregadoError(true)
                    setTimeout(() => {
                        setAgregadoError(false)
                    }, 3000)
                }
            })
            .catch((err) => {
                setError(err.message)
            });

    }

    if (carrito.productos) {

        return (

            <div className="cont-admin-cursos  cont-list-productos">
                <h1>Carrito</h1>
                {agregadoError && (
                    <div className="alert alert-danger" role="alert">
                        Error al agregar el producto a tu carrito. Inténtalo de nuevo.
                    </div>
                )}

                <p><b>Total:</b> ${total}</p>

                <ul className="listado-productos">
                    {carrito.productos.map((producto) => {
                        return (
                            <li key={producto._id}>
                                <Card key={producto._id}>
                                    {/* <div className="card-img"> */}
                                    <Card.Img className="card-img" variant="top" src={ImagePlaceholder} />

                                    {/* </div> */}
                                    <Card.Body>
                                        <h2 className="title">{producto.nombre}</h2>
                                        <Link className="card_link" to={`/tienda/producto/id-${producto._id}`}></Link>
                                        <Card.Text className="precio">
                                            ${producto.precio}
                                        </Card.Text>
                                        <Card.Text>
                                            {producto.descripcion}
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Footer>
                                        {/* <small className="text-muted">Last updated 3 mins ago</small> */}
                                        <div className="counter-cantidad btn-carrito">
                                            <span className="icon-carrito">
                                            </span>
                                            <div>
                                                <Button variant="danger" onClick={() => handleSubstractItemToCart(producto._id)}>-</Button>

                                                {checkQuantity(producto._id) || 0}

                                                <Button variant="success" onClick={() => handleAddItemToCart(producto._id)}>+</Button>
                                            </div>
                                        </div>
                                    </Card.Footer>
                                </Card>
                            </li>
                        );
                    })}
                </ul>
                {/* <ul className="listado-cursos">
                    {carrito.productos
                        .map((producto, index) => (
                            <li key={`${index}`}>
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
                </ul> */}


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
