import "./VerTienda.css";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as carritoService from "../../services/carrito.service";
import * as comprasService from "../../services/compras.service";

import Loader from "../basics/Loader";
import { Col, Container, Nav, Row, Button, Modal, ListGroup, Card } from "react-bootstrap";
import * as productosService from "../../services/productos.service";

import ImagePlaceholder from "../../img/placeholder-image.jpg";
import LoaderMini from "../basics/LoaderMini";
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { FreeMode, Pagination } from "swiper";




export function VerCarrito() {
    let navigate = useNavigate();
    const params = useParams();

    const [productosComprar, setProductosComprar] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [importeCarrito, setImporteCarrito] = useState(0);
    const [cantidadCarrito, setCantidadCarrito] = useState(0);
    const [demoraCarrito, setDemoraCarrito] = useState(0);
    const [nombre, setNombre] = useState("");
    const [usuarioId, setUsuarioId] = useState("");
    const [carritoId, setCarritoId] = useState("");
    const [loadingQuantities, setLoadingQuantities] = useState(false);
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
                    console.log('funcioné')
                    resolve(data);
                })
                .catch((err) => {
                    console.log('fallé')
                    reject(err);
                });
        })
    }

    function loadCarrito(usuarioId) {
        return new Promise((resolve, reject) => {
            getCarritobyIdUser(usuarioId).then((data) => {
                if (!data.err) {
                    setCarrito(data)
                    calcularImporteCarrito(data.productos)
                    calcularCantidadCarrito(data.productos)
                    calcularDemora(data.productos)
                    setLoadingQuantities(false)
                    localStorage.setItem("carrito", JSON.stringify(data))
                } else {
                    crearCarritoParaUsuario(usuarioId)
                    setLoadingQuantities(false)

                }
            }).catch((err) => {
                console.error(err)
            });
        })
    }

    /**
     * Calcula el monto total del carrito. El cálculo se hace sumando el producto del precio y cantidad de cada producto.
     *
     * @param {Array} carrito - El arreglo de productos en el carrito.
     * @return {void} La función no retorna ningún valor.
     */
    function calcularImporteCarrito(carrito) {
        let total = 0
        console.log(carrito)
        carrito.forEach(producto => {
            total += producto.precio * producto.cantidad
        })

        setImporteCarrito(total)
    }

    /**
     * Calcula el monto total del carrito. El cálculo se hace sumando el producto del precio y cantidad de cada producto.
     *
     * @param {Array} carrito - El arreglo de productos en el carrito.
     * @return {void} La función no retorna ningún valor.
     */
    function calcularCantidadCarrito(carrito) {
        let total = 0
        console.log(carrito)
        carrito.forEach(producto => {
            total += producto.cantidad
        })

        setCantidadCarrito(total)
    }

    /**
     * Calcula la demora de la entrega de los productos. El cálculo se hace tomando la mayor de las demoras de todos los productos, y se le suma la cantidad total de items del carrito.
     *
     * @param {Array} carrito - El arreglo de productos en el carrito.
     * @return {void} La función no retorna ningún valor.
     */
    function calcularDemora(carrito) {
        let total = carrito.map((x) => x.demora_producto).reduce((a, b) => a > b ? a : b)
        carrito.forEach(producto => {
            total += producto.cantidad
        })
        setDemoraCarrito(total)
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

    function handleClickFinalizar() {
        console.log("finalizar compra")
        setShowModal(true);

    }

    async function handleConfirmar() {
        console.log(carrito.productos.map((producto) => ({ id: producto.id, cantidad: producto.cantidad })))

        let compra = {
            usuarioId: carrito.usuarioId,
            carritoId: carrito._id,
            productos: carrito.productos.map((producto) => ({ id: producto.id, cantidad: producto.cantidad })),
        }

        comprasService.create(compra).then((data) => {
            carritoService.remove(carrito._id).then((carrito) => {
                console.log(data)
                setShowModal(false);
                setShowSuccessModal(true);

                loadCarrito((JSON.parse(localStorage.getItem('user')))._id)
            }).catch((err) => setError(err.message));
        }).catch((err) => setError(err.message));

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
        setLoadingQuantities(true)
        carritoService.update(carrito)
            .then((response) => {
                if (response) {
                    loadCarrito((JSON.parse(localStorage.getItem('user')))._id)
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

            <div className="cont-admin-cursos cont-list-carrito d-flex justify-content-between">
                <div className="detalle">
                    <h1>Carrito</h1>


                    {agregadoError && (
                        <div className="alert alert-danger" role="alert">
                            Error al agregar el producto a tu carrito. Inténtalo de nuevo.
                        </div>
                    )}


                    <Swiper
                        slidesPerView={3.5}
                        spaceBetween={30}
                        freeMode={false}
                        // pagination={{
                        //   clickable: true,
                        // }}
                        modules={[FreeMode, Pagination]}
                        className="mySwiper"
                    >
                        {carrito.productos.map((producto) => {
                            return (
                                <SwiperSlide key={producto._id}>
                                    <Card key={producto._id}>
                                        <Card.Img className="card-img" variant="top" src={ImagePlaceholder} />
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
                                            <div className="counter-cantidad btn-carrito">
                                                <span className="icon-carrito">
                                                </span>
                                                <div>
                                                    {loadingQuantities ? <LoaderMini className="loader-mini" /> :
                                                        <>
                                                            <Button variant="danger" onClick={() => handleSubstractItemToCart(producto._id)} disabled={loadingQuantities}>-</Button>

                                                            {checkQuantity(producto._id) || 0}

                                                            <Button variant="success" onClick={() => handleAddItemToCart(producto._id)} disabled={loadingQuantities}>+</Button>
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        </Card.Footer>
                                    </Card>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>

                </div>
                <Card className="resumen">
                    <Card.Body>
                        <h2 className="title">Resumen de compra</h2>
                        <Card.Text className="precio">
                            Importe: ${importeCarrito}
                        </Card.Text>
                        <Card.Text>
                            Cantidad: {cantidadCarrito} items
                        </Card.Text>
                        <Card.Text>
                            Demora: {demoraCarrito} días
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer className="d-grid gap-2">
                        {/* {loadingQuantities ? <LoaderMini className="loader-mini" /> : */}
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loadingQuantities}
                            onClick={() => handleClickFinalizar()}
                        >Finalizar Compra
                        </Button>
                        {/* } */}
                    </Card.Footer>
                </Card>


                <Modal show={showModal} onHide={handleCancelar}>
                    <Modal.Header closeButton>
                        <Modal.Title className="p-2">Finalizar Compra</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>¿Estás seguro de que quieres finalizar la compra?</p>
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
