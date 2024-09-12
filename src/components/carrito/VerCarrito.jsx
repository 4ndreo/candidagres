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


import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { CartProduct } from "../productos/CartProduct/CartProduct";
import { useQuery } from "react-query";

const user = JSON.parse(localStorage.getItem('user'));


export function VerCarrito() {
    const SERVER_URL = process.env.REACT_APP_SERVER_URL;
    let navigate = useNavigate();
    const params = useParams();

    const [productosComprar, setProductosComprar] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalDelay, setTotalDelay] = useState(0);
    const [nombre, setNombre] = useState("");
    // const [usuarioId, setUsuarioId] = useState("");
    const [carritoId, setCarritoId] = useState("");
    const [loadingQuantities, setLoadingQuantities] = useState(false);
    const [eliminadoCorrectamente, setEliminadoCorrectamente] = useState(false);

    const [agregadoError, setAgregadoError] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [error, setError] = useState("");
    const [preferenceId, setPreferenceId] = useState(null);
    initMercadoPago(process.env.REACT_APP_MP_PUBLIC_KEY, { locale: 'es-AR' });

    const fetchCart = async () => {
        let result;
        const cart = await carritoService.findByIdUser(params?.idUsuario);
       
            result = { ...cart, totalCost: calcularImporteCarrito(cart?.productos), totalQuantity: calcularCantidadCarrito(cart?.productos), totalDelay: calcularDemora(cart?.productos) }
            localStorage.setItem("carrito", JSON.stringify(result))
            
        
        return JSON.parse(JSON.stringify(result));

    }

    const { data: cart, isLoading, isError, refetch } = useQuery(
        'cart',
        fetchCart,
        {
            staleTime: 10000,
            retry: 2,
        }
    );

    // function getCarritobyIdUser(usuarioId) {
    //     return new Promise((resolve, reject) => {
    //         carritoService.findByIdUser(usuarioId)
    //             .then((data) => {
    //                 resolve(data);
    //             })
    //             .catch((err) => {
    //                 reject(err);
    //             });
    //     })
    // }

    useEffect(() => {
        async function onInit() {

            await handleCreatePreference(cart)
        }
        onInit();
    }, [cart]);

    async function handleCreatePreference(cart) {
        try {
            const preferences = {
                usuarioId: cart.usuarioId,
                carritoId: cart._id,
                state: "pending",
                items: cart.productos.map((product) => ({
                    title: product.nombre,
                    description: product.descripcion,
                    unit_price: product.precio,
                    quantity: product.cantidad,
                    material: product.material
                })),
                totalCost: cart.totalCost,
                totalQuantity: cart.totalQuantity,
                totalDelay: cart.totalDelay,
            }
            console.log('preferences')
            await carritoService.createPreference(preferences)
                .then((response) => {
                    // console.log('respuiesta', response.id)
                    // const { id } = response.id;
                    console.log('id resp', response.id)
                    setPreferenceId(response.id)
                    return response.id;
                })
                .catch((err) => {
                    console.log('error')
                    return err
                });
        } catch (error) {
            console.log('error catch', error)
            return error
        }
    }

    // const handleBuy = async () => {
    //     console.log('handleBuy', await handleCreatePreference(carrito))
    //     let id = '';
    //     console.log('id', id)
    //     if (id) {
    //     }
    // }

    // function loadCarrito(usuarioId) {
    //     return new Promise((resolve, reject) => {
    //         getCarritobyIdUser(usuarioId).then((data) => {
    //             if (!data.err) {
    //                 setCarrito(data)
    //                 calcularImporteCarrito(data.productos)
    //                 calcularCantidadCarrito(data.productos)
    //                 calcularDemora(data.productos)
    //                 setLoadingQuantities(false)
    //                 localStorage.setItem("carrito", JSON.stringify(data))
    //             } else {
    //                 crearCarritoParaUsuario(usuarioId)
    //                 setLoadingQuantities(false)

    //             }
    //         }).catch((err) => {
    //             console.error(err)
    //         });
    //     })
    // }

    /**
     * Calcula el monto total del carrito. El cálculo se hace sumando el producto del precio y cantidad de cada producto.
     *
     * @param {Array} carrito - El arreglo de productos en el carrito.
     * @return {void} La función no retorna ningún valor.
     */
    function calcularImporteCarrito(carrito) {
        let total = 0
        carrito.forEach(producto => {
            total += producto.precio * producto.cantidad
        })
        return total;
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
        return total;
    }

    /**
     * Calcula la demora de la entrega de los productos. El cálculo se hace tomando la mayor de las demoras de todos los productos, y se le suma la cantidad total de items del carrito.
     *
     * @param {Array} carrito - El arreglo de productos en el carrito.
     * @return {void} La función no retorna ningún valor.
     */
    function calcularDemora(carrito) {
        let total = 0;
        if (carrito.length > 0) {
            total = carrito.map((x) => x.demora_producto).reduce((a, b) => a > b ? a : b)
            carrito.forEach(producto => {
                total += producto.cantidad
            })
        }
        return total;
    }

    // function crearCarritoParaUsuario(usuarioId) {
    //     carritoService.create(usuarioId)
    //         .then((data) => {
    //             // const idNewCarrito = traerIdNewCarrito(data, usuarioId)
    //             setCarrito(data)
    //             localStorage.setItem("carrito", JSON.stringify(data))
    //             //todo recibir idCarrito y setearlo para poder mandarlo en el update
    //         })
    //         .catch((err) => {
    //             setError(err.message)
    //         });
    // }

    function handleAddItemToCart(productoId) {
        guardarProducto(productoId, 'add')
        actualizarCarrito(cart)
    }

    function handleSubstractItemToCart(productoId) {
        guardarProducto(productoId, 'substract')
        actualizarCarrito(cart)
    }

    function guardarProducto(productoId, operacion) {
        let nuevoProducto = true;

        cart.productos.forEach((producto, index) => {
            if (producto.id === productoId) {
                console.log('antes de restar', JSON.stringify(cart.productos))
                nuevoProducto = false;
                operacion === 'add' ? cart.productos[index].cantidad++ : cart.productos[index].cantidad--;
                if (cart.productos[index].cantidad <= 0) {
                    cart.productos.splice(index, 1);
                }
                console.log('despues de restar', JSON.stringify(cart.productos))
            }
        })
        if (nuevoProducto && operacion === 'add') {
            cart.productos.push({ id: productoId, cantidad: 1 })
        }
    }

    function checkQuantity(productoId) {
        // console.log(productoId)
        return cart.productos.find(producto => producto.id === productoId)?.cantidad
    }

    function actualizarCarrito(carrito) {
        localStorage.setItem("carrito", JSON.stringify(carrito))
        setLoadingQuantities(true)
        carritoService.update(carrito)
            .then((response) => {
                if (response) {
                    // loadCarrito(user._id)
                    refetch()
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

    if (isLoading) {
        return <Loader></Loader>
    }


    const renderItems = (cart) => {
        if (cart.productos.length === 0) {
            return <p>Tu carrito se encuentra vacío.</p>
        }
        return cart.productos.map((producto) => {
            return (

                <CartProduct key={producto._id} producto={producto}
                    loadingQuantities={loadingQuantities}
                    handleSubstractItemToCart={handleSubstractItemToCart}
                    checkQuantity={checkQuantity}
                    handleAddItemToCart={handleAddItemToCart}></CartProduct>
            )
        })
    }


    return (

        <div className="cont-admin-cursos cont-list-carrito d-flex justify-content-between gap-3">
            <div className="detalle">
                <h1 className="mb-4">Carrito</h1>


                {isError ?
                    <div className="alert alert-danger" role="alert">
                        Ha habido un error. Inténtalo de nuevo más tarde.
                    </div>
                    :
                    renderItems(cart)
                }

            </div>
            <Card className="resumen">
                <Card.Body>
                    <h2 className="title">Resumen de compra</h2>
                    <Card.Text className="precio">
                        Importe: ${cart?.totalCost || 0}
                    </Card.Text>
                    <Card.Text>
                        Cantidad: {(cart?.totalQuantity || 0) === 1 ? (cart?.totalQuantity || 0) + ' artículo' : (cart?.totalQuantity || 0) + ' artículos'}
                    </Card.Text>
                    <Card.Text>
                        Demora: {cart?.totalDelay || 0} días
                    </Card.Text>
                </Card.Body>
                <Card.Footer className="d-grid gap-2">
                    {/* {loadingQuantities ? <LoaderMini className="loader-mini" /> : */}
                    {/* <Button
                            variant="primary"
                            type="submit"
                            disabled={loadingQuantities}
                            // onClick={() => handleClickFinalizar()}
                            onClick={() => handleBuy()}
                        >Finalizar Compra
                        </Button> */}
                    {preferenceId && cart.productos.length > 0 ?
                        <Wallet initialization={{ preferenceId: preferenceId }} customization={{ texts: { valueProp: 'smart_option' } }}
                        // onSubmit={() => handleSavePendingPurchase(carrito)}
                        />
                        :
                        <Button
                            variant="secondary"
                            type="submit"
                            disabled
                        > Pagar
                        </Button>
                    }
                </Card.Footer>
            </Card>
        </div>
    );
}
