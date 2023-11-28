import "./css/Cursos.css";

import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as productosService from "../../services/productos.service";
import { AuthContext } from "../../App";

export default function Productos() {
    const [productos, setProductos] = useState([]);

    const value = useContext(AuthContext);

    let navigate = useNavigate();

    useEffect(() => {
        if (value.currentUser.role !== 1) {
            navigate("/", { replace: true });
        }
    }, []);

    useEffect(() => {
        productosService.find().then((data) => {
            setProductos(data);
        });
    }, []);

    function handleDeleteElement(item) {
        productosService.remove(item._id).then((productos) => {
            console.log(productos);
            setProductos(productos);
        });
    }

    return (
        <main className="container main">
            <div className="cont-admin-cursos">
                <h1>Administrar Productos</h1>
                <Link to="producto" className="btn btn-primary mt-3">
                    Crear un Producto
                </Link>
                <ul>
                    {productos.map((producto) => {
                        // return <p>{curso.horario}</p>
                        return (
                            <li key={producto._id}>
                                <p>Nombre: {producto.nombre}</p>
                                <p>Descripción: {producto.descripcion}</p>
                                <p>Precio: $ {producto.precio} </p>
                                <p>Demora: {producto.demora_producto} dias </p>
                                <p>Material: {producto.material} </p>
                                <Link
                                    to={"producto/id-" + producto._id}
                                    className="btn btn-warning me-2"
                                >
                                    Editar Producto
                                </Link>
                                <button
                                    onClick={() => handleDeleteElement(producto)}
                                    className="btn btn-danger"
                                    type="button"
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title=""
                                    data-original-title="Delete"
                                >
                                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                                    Eliminar Producto
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </main>
    );
}
