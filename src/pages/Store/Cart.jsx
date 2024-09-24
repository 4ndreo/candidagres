import "./Cart.css";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as carritoService from "../../services/carrito.service";

import { Button, Card } from "react-bootstrap";

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { useQuery } from "react-query";
import Loader from "../../components/basics/Loader";
import { CartProduct } from "../../components/productos/CartProduct/CartProduct";
import LoaderMini from "../../components/basics/LoaderMini";
import { calculateDelay, calculateTotalCost, calculateTotalQuantity } from "../../utils/utils";

export function Cart() {
    const params = useParams();

    const [initPoint, setInitPoint] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        initMercadoPago(process.env.REACT_APP_MP_PUBLIC_KEY, { locale: 'es-AR' });

    }, [])

    const fetchCart = async () => {
        setInitPoint(null)
        const res = await carritoService.findByIdUser(params?.idUsuario);
        const result = { ...res, totalCost: calculateTotalCost(res?.items), totalQuantity: calculateTotalQuantity(res?.items), totalDelay: calculateDelay(res?.items) }
        await handleCreatePreference(res)
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
            setInitPoint(preference.init_point)
        } catch (error) {
            return error
        }
    }

    const renderItems = (cart) => {
        if (cart.items.length === 0) {
            return <p>Tu carrito se encuentra vacío.</p>
        }
        return cart.items.map((item) => {
            return (
                <CartProduct key={item._id} props={{ idUser: params?.idUsuario, item: item, refetch: refetch, setInitPoint: setInitPoint }} ></CartProduct>
            )
        })
    }

    const renderError = () => {
        return (
            <div className="alert alert-danger" role="alert">
                {error.message}
            </div>
        )
    }

    const renderMPButton = () => {
        if (!initPoint) {
            return <LoaderMini></LoaderMini>
        }
        return (
            <a className="d-block" href={initPoint}>
                <Button
                    className="w-100"
                    variant="primary"
                    type="submit"
                > Ir a pagar
                </Button>
            </a>
        )
    }

    if (isLoading) {
        return <Loader></Loader>
    }

    return (
        <div>
            <h1 className="mb-4">Carrito</h1>
            <div className="cont-cart d-flex justify-content-between gap-3">
                <div className="detalle">
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
                        {
                            renderMPButton()
                        }
                    </Card.Footer>
                </Card>
            </div>
        </div>
    );
}
