import "./css/Cursos.css";

import React, { useEffect, useState, useContext } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import * as productosService from "../services/productos.service";
import { AuthContext } from "../App";
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap'; // Importa los componentes de Bootstrap

import Loader from "../components/basics/Loader";

export default function VerProductoId() {

    const params = useParams();

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [demora_producto, setDemora] = useState();
    const [precio, setPrecio] = useState();
    const [material, setMaterial] = useState();





    useEffect(() => {
        productosService.findById(params?.idProducto).then((producto) => {
            setNombre(producto.nombre);
            setDescripcion(producto.descripcion);
            setDemora(producto.demora_producto);
            setPrecio(producto.precio);
            setMaterial(producto.material);
            //console.log(data)
        });
    }, []);

    if (nombre.length > 0 ){

        return (

            <main className="container">
                <div className="mb-3 cont-admin-cursos">
                 <h1>{nombre}</h1>
                    <ul>
                        <li>Descripción: {descripcion}</li>
                        <li>Demora: {demora_producto} días</li>
                        <li>$ {precio}</li>
                        <li>Material: {material}</li>
                    </ul>

                    <Link to="/tienda" className="btn btn-primary mt-3">
                        Volver
                    </Link>
                </div>
            </main>
        );
    } else
    {
        return (
            <main className="container main">
                <Loader></Loader>
            </main>
        )
    }
}


