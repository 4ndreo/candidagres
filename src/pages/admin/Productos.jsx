import "./AdminClasses/AdminClasses.css";

import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as productosService from "../../services/productos.service";
import { AuthContext } from "../../App";
import * as turnosService from "../../services/turnos.service";
import Loader from "../../components/basics/Loader";
import { Button, Modal } from "react-bootstrap";
import { PreviewProducto } from "../../components/productos/PreviewProducto";

export default function Productos() {
    const [productos, setProductos] = useState([]);
    const [productoEliminar, setProductoEliminar] = useState();
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = (productoSeleccionado) => { setShow(true); setProductoEliminar(productoSeleccionado) };

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
            setLoading(false);
        });
    }, []);

    function handleSelectedDelete(item) {
        setProductoEliminar(item);
    }

    function handleConfirmDelete(item) {
        productosService.remove(item._id).then((productos) => {
            setProductos(productos);

        });
    }

    return (
        <div className="cont-admin-cursos">
            <h1>Administrar Productos</h1>
            <Link to="producto" className="btn btn-primary mt-3 btn-icon">
                <span className="pi pi-plus"></span>Crear un Producto
            </Link>
            {loading ? (
                <Loader className="w-50"></Loader>
            ) : (
                <ul>
                    {productos.map((producto) => {
                        return (
                            <li className="card mb-3" key={producto._id}>
                                <PreviewProducto producto={producto} editBtn={true} handleShow={handleShow} handleSelectedDelete={handleSelectedDelete}></PreviewProducto>
                                {/* <div className="row g-0">
                                        <div className="col-md-3">
                                            <img src="..." className="img-fluid rounded-start" alt="..." />
                                        </div>
                                        <div className="col-md-9">
                                            <div className="row g-0">
                                                <div className="card-body col-md-8">
                                                    <small className="text-body-secondary">Demora: {producto.demora_producto} dias</small>
                                                    <h5 className="card-title">Nombre: {producto.nombre}</h5>
                                                    <p className="card-text">Descripción: {producto.descripcion}</p>
                                                    <p>Material: <span className="badge text-bg-primary">{producto.material}</span></p>
                                                    ${producto.precio}
                                                </div>
                                                <div className="col-md-4 d-flex align-items-end justify-content-end">
                                                    <Link to={"producto/id-" + producto._id} className="btn btn-warning btn-editar me-2">
                                                        <span>Editar</span>
                                                    </Link>
                                                    <button
                                                        onClick={() => { handleShow(); handleSelectedDelete(producto); }}
                                                        className="btn btn-danger btn-eliminar"
                                                        type="button"
                                                        data-toggle="tooltip"
                                                        data-placement="top">
                                                        <span>Eliminar</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                            </li>
                        );
                    })}
                </ul>
            )}
            <Modal show={show} onHide={handleClose} size="lg" variant="white" className="modal-delete">
                <Modal.Header className="modal-title" closeButton>
                    <Modal.Title className="negritas">¿Seguro querés eliminar el producto "{productoEliminar?.nombre}"?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><span className="negritas">Esta acción es irreversible</span></p>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        onClick={() => { handleClose(); }}
                        className="btn btn-link btn-close-link"
                        type="button"
                        data-toggle="tooltip"
                        data-placement="top">
                        <span>Cerrar</span>
                    </button>
                    <button
                        onClick={() => { handleConfirmDelete(productoEliminar); handleClose(); }}
                        className="btn btn-danger btn-eliminar"
                        type="button"
                        data-toggle="tooltip"
                        data-placement="top">
                        <span>Eliminar definitivamente</span>
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
