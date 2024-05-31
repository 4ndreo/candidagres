import "./VerTienda.css";

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as carritoService from "../../services/carrito.service";

import Loader from "../basics/Loader";
import { Col, Container, Nav, Row, Button, Modal, ListGroup, Card, Form } from "react-bootstrap";
import * as productosService from "../../services/productos.service";

import ImagePlaceholder from "../../img/placeholder-image.jpg";


export function VerTienda() {

    let navigate = useNavigate();

    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [productosComprar, setProductosComprar] = useState([]);
    const [usuarioId, setUsuarioId] = useState("");
    const [carritoId, setCarritoId] = useState("");
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState();
    const [total, setTotal] = useState(0);
    const [producto, setProducto] = useState([]);
    const [agregadoError, setAgregadoError] = useState(false);
    const [productoAgregado, setProductoAgregado] = useState("");
    const [error, setError] = useState("");


    useEffect(() => {
        setUsuarioId((JSON.parse(localStorage.getItem('user')))._id)
        loadProductos((JSON.parse(localStorage.getItem('user')))._id)
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

    function loadProductos(usuarioId) {
        return new Promise((resolve, reject) => {
            getProductos().then(() => {
                getCarritobyIdUser(usuarioId).then((data) => {
                    if (data === null) {
                        crearCarritoParaUsuario(usuarioId)
                    } else {
                        setCarrito(data)
                        localStorage.setItem("carrito", JSON.stringify(data))
                    }
                })
            })
                .catch((err) => {
                    console.error(err)
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

    // function traerIdNewCarrito(carritos, idUsuario) {
    //     const objetoEncontrado = carritos.find(carrito => carrito.usuarioId === idUsuario);
    //     return objetoEncontrado ? objetoEncontrado._id : null;
    // }

    function handleAddItemToCart(productoId) {
        guardarProducto(productoId, 'add')
        actualizarCarrito(carrito)
    }

    function handleSubstractItemToCart(productoId) {
        guardarProducto(productoId, 'substract')
        actualizarCarrito(carrito)
    }

    function checkQuantity(productoId) {
        // console.log(productoId)
        return carrito.productos.find(producto => producto.id === productoId)?.cantidad
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

    function actualizarCarrito(carrito) {
        localStorage.setItem("carrito", JSON.stringify(carrito))
        carritoService.update(carrito)
            .then((response) => {
                if (response) {
                    setCarrito({...carrito})
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

    if (productos.length > 0 && carrito.productos && carrito) {

        return (
            <div className="cont-admin-cursos cont-list-productos">
                <h1>Productos</h1>
                {agregadoError && (
                    <div className="alert alert-danger" role="alert">
                        Error al agregar el producto a tu carrito. Inténtalo de nuevo.
                    </div>
                )}
                <ul className="listado-productos">
                    {productos.map((producto) => {
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
            </div>
        )
    } else {
        return (
            <Loader></Loader>
        )
    }
}


