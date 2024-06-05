import "./HistorialCompras.css";

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as carritoService from "../../services/carrito.service";
import * as comprasService from "../../services/compras.service";

import Loader from "../basics/Loader";
import { Col, Container, Nav, Row } from "react-bootstrap";
import * as productosService from "../../services/productos.service";
import { findByIdUser } from "../../services/carrito.service";



export function HistorialCompras() {
    let navigate = useNavigate();
    const params = useParams();

    const [compras, setCompras] = useState([]);
    const [total, setTotal] = useState(0);
    const [importeCarrito, setImporteCarrito] = useState(0);
    const [cantidadCarrito, setCantidadCarrito] = useState(0);
    const [demoraCarrito, setDemoraCarrito] = useState(0);
    const [nombre, setNombre] = useState("");
    const [usuarioId, setUsuarioId] = useState("");
    const [eliminadoCorrectamente, setEliminadoCorrectamente] = useState(false);
    // const [productoEliminado, setProductoEliminado] = useState("");
    const [error, setError] = useState("");



    useEffect(() => {

        const usuarioGuardado = localStorage.getItem('user');

        const usuarioObjeto = JSON.parse(usuarioGuardado);

        setNombre(usuarioObjeto.email);
        setUsuarioId(usuarioObjeto._id);



        traerCarritoUsuario(params?.idUsuario)

    }, []);

    function calcularImporteCarrito(carrito) {
        let total = 0
        console.log('carrito', carrito)
        carrito.forEach(producto => {
            total += producto.precio * producto.cantidad
        })

        return total
    }

    /**
     * Calcula el monto total del carrito. El cálculo se hace sumando el producto del precio y cantidad de cada producto.
     *
     * @param {Array} carrito - El arreglo de productos en el carrito.
     * @return {void} La función no retorna ningún valor.
     */
    function calcularCantidadCarrito(carrito) {
        let total = 0
        carrito.forEach(producto => {
            total += producto.cantidad
        })

        return total
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
        return total
    }





    function traerCarritoUsuario(idUsuario) {
        comprasService.findByIdUser(idUsuario).then((compras) => {
            compras.map((compra) => {
                compra.importeTotal = calcularImporteCarrito(compra.productos)
                compra.cantidadTotal = calcularCantidadCarrito(compra.productos)
                compra.demoraTotal = calcularDemora(compra.productos)
            })
            setCompras(compras)
            console.log(compras)
        })
        // carritoService.findByIdUserFinalizado(idUsuario).then((carrito) => {

        //     console.log(carrito)
        //     setProductosComprados(carrito)
        //     // setTotal(carrito.total);
        //     // setProductosComprar(carrito.productosComprar)
        //     //
        //     // console.log(carrito.total, carrito.productosComprar)
        // }).catch((err) => setError(err.message));
    }



    if (compras.length > 0) {
        return (
            <>
                <h1>Historial de compras - {nombre}</h1>
                <div className="cont-historial">
                    {compras.map((compra, index) => (
                        <div key={index} className="cont-compra-fecha">
                            <p className="fecha">{new Date(compra.created_at).toLocaleDateString()}</p>
                            <ul className="cont-compra">
                                <li className="item-compra">
                                    <div className="cont-resumen">

                                        <h2>Resumen</h2>
                                        <p><span className="negritas">Importe total:</span> ${compra.importeTotal}</p>
                                        <p><span className="negritas">Cantidad total:</span> {compra.cantidadTotal} artículos</p>
                                        <p><span className="negritas">Demora:</span> {compra.demoraTotal} días</p>
                                    </div>

                                    <ul className="cont-articulos">
                                        {compra.productos.map((producto, subIndex) => (
                                            <li key={`${index}-${subIndex}`}>
                                                <h3>{producto.nombre}</h3>
                                                <p>${producto.precio}</p>
                                                <p>{producto.cantidad}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    ))}
                </div>
            </>
        );

    } else {
        return (
            <Loader></Loader>
        );
    }
}
