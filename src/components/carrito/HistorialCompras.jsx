import "../css/Edit.css";

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as carritoService from "../../services/carrito.service";

import Loader from "../basics/Loader";
import { Col, Container, Nav, Row } from "react-bootstrap";
import * as productosService from "../../services/productos.service";
import { findByIdUser } from "../../services/carrito.service";



export function HistorialCompras() {
    let navigate = useNavigate();
    const params = useParams();

    const [productosComprados, setProductosComprados] = useState([]);
    const [total, setTotal] = useState(0);
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



    if (productosComprados.length > 0) {
        return (
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
        );

    } else {
        return (
            <Loader></Loader>
        );
    }
}
