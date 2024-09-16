import "./Cart.css";

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import * as carritoService from "../../services/carrito.service";

import { Button, Card } from "react-bootstrap";

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { useQuery } from "react-query";
import Loader from "../../components/basics/Loader";
import { CartProduct } from "../../components/productos/CartProduct/CartProduct";

export function Cart() {
    const params = useParams();

    const [preferenceId, setPreferenceId] = useState(null);
    const [error, setError] = useState(null);
    initMercadoPago(process.env.REACT_APP_MP_PUBLIC_KEY, { locale: 'es-AR' });

    const fetchCart = async () => {
        const res = await carritoService.findByIdUser(params?.idUsuario);
        const result = { ...res, totalCost: calcularImporteCarrito(res?.items), totalQuantity: calcularCantidadCarrito(res?.items), totalDelay: calcularDemora(res?.items) }
        // await handleCreatePreference(res)
        return JSON.parse(JSON.stringify(result));
    }

    const { data: cart, isLoading, isError, refetch } = useQuery(
        'cart',
        fetchCart,
        {
            staleTime: 1000,
            retry: 2,
            onError: (err) => setError(err || 'Ha habido un error. Inténtalo de nuevo más tarde.'),
        }
    );

    async function handleCreatePreference(cart) {
        const preferences = {
            usuarioId: cart.usuarioId,
            carritoId: cart._id,
            state: "pending",
            items: cart.items.map((product) => ({
                title: product.nombre,
                description: product.descripcion,
                unit_price: product.precio,
                quantity: product.quantity,
                material: product.material
            })),
            totalCost: cart.totalCost,
            totalQuantity: cart.totalQuantity,
            totalDelay: cart.totalDelay,
        }
        try {
            const preference = await carritoService.createPreference(preferences)
            console.log('preference', preference)
            setPreferenceId(preference.id)
        } catch (error) {
            return error
        }
    }

    /**
     * Calcula el monto total del carrito. El cálculo se hace sumando el producto del precio y cantidad de cada producto.
     *
     * @param {Array} items - El arreglo de productos en el carrito.
     * @return {void} La función no retorna ningún valor.
     */
    function calcularImporteCarrito(items) {
        let total = 0
        items.forEach(producto => {
            total += producto.precio * producto.quantity
        })
        return total;
    }

    /**
     * Calcula el monto total del carrito. El cálculo se hace sumando el producto del precio y cantidad de cada producto.
     *
     * @param {Array} items - El arreglo de productos en el carrito.
     * @return {void} La función no retorna ningún valor.
     */
    function calcularCantidadCarrito(items) {
        let total = 0
        items.forEach(producto => {
            total += producto.quantity
        })
        return total;
    }

    /**
     * Calcula la demora de la entrega de los productos. El cálculo se hace tomando la mayor de las demoras de todos los productos, y se le suma la cantidad total de items del carrito.
     *
     * @param {Array} items - El arreglo de productos en el carrito.
     * @return {void} La función no retorna ningún valor.
     */
    function calcularDemora(items) {
        let total = 0;
        if (items.length > 0) {
            total = items.map((x) => x.demora_producto).reduce((a, b) => a > b ? a : b)
            items.forEach(producto => {
                total += producto.quantity
            })
        }
        return total;
    }


    const renderItems = (cart) => {
        if (cart.items.length === 0) {
            return <p>Tu carrito se encuentra vacío.</p>
        }
        return cart.items.map((producto) => {
            return (
                <CartProduct key={producto._id} idUser={params?.idUsuario} producto={producto} editing={preferenceId}
                ></CartProduct>
            )
        })
    }

    const renderError = (cart) => {
        return (
            <div className="alert alert-danger" role="alert">
                {error.message}
            </div>
        )
    }

    if (isLoading) {
        return <Loader></Loader>
    }

    return (

        <div className="cont-cart d-flex justify-content-between gap-3">
            <div className="detalle">
                <h1 className="mb-4">Carrito</h1>
                {isError ?
                    renderError()
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
                    {preferenceId ?
                        <>
                            <Button className="btn-back-to-cart text-decoration-none" variant="link" onClick={() => setPreferenceId(null)}><span className="pi pi-arrow-left"></span> Volver al carrito</Button>

                            <Wallet initialization={{ preferenceId: preferenceId }} customization={{ texts: { valueProp: 'smart_option' } }} />
                        </>
                        :
                        <Button
                            variant="primary"
                            disabled={cart.items.length < 1}
                            onClick={() => setPreferenceId(handleCreatePreference(cart))}
                        >Ir a pagar
                        </Button>
                    }
                </Card.Footer>
            </Card>
        </div>
    );
}
