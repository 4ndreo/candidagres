import "./css/VerProducto.css";

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as productosService from "../services/productos.service";

import Loader from "../components/basics/Loader";
// import { ViewProducto } from "../components/productos/ViewProducto/ViewProducto";

export default function VerProductoId() {

    const params = useParams();
    const [producto, setProducto] = useState(null);

    useEffect(() => {
        productosService.findById(params?.idProducto).then((producto) => {
            setProducto(producto);
        });
    }, []);

    if (producto) {
        return (
            <main className="container">
                
                {/* <ViewProducto producto={producto}></ViewProducto> */}
            </main>
        );
    } else {
        return (
            <main className="container main">
                <Loader></Loader>
            </main>
        )
    }
}


