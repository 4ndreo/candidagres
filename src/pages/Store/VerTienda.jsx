import "./VerTienda.css";

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as carritoService from "../../services/carrito.service";

import { Col, Container, Nav, Row, Button, Modal, ListGroup, Card, Form } from "react-bootstrap";
import * as productosService from "../../services/productos.service";

import ImagePlaceholder from "../../img/placeholder-image.jpg";
import { useQuery } from "react-query";
import Loader from "../../components/basics/Loader";


export function VerTienda() {
    const SERVER_URL = process.env.REACT_APP_SERVER_URL;
    let navigate = useNavigate();
    const location = useLocation();

    const [searchParams, setSearchParams] = useSearchParams()
    const [mpParams, setMpParams] = useState({});
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [loadingQuantities, setLoadingQuantities] = useState(false);
    const [usuarioId, setUsuarioId] = useState("");
    const [agregadoError, setAgregadoError] = useState(false);
    const [error, setError] = useState("");

    const fetchProducts = async () => {
        const result = await productosService.find();
        return JSON.parse(JSON.stringify(result));
    }

    const { data: products, isLoading, isError, refetch } = useQuery(
        'products',
        fetchProducts,
        {
            staleTime: 10000,
            retry: 2,
        }
    );

    const renderError = (cart) => {
        return (
            <div className="alert alert-danger" role="alert">
                Ha habido un error. Inténtalo de nuevo más tarde.
            </div>
        )
    }

    if (isLoading) {
        return <Loader></Loader>
    }

    return (
        <div className="cont-admin-cursos cont-list-productos">
            <h1 className="mb-4">Productos</h1>
            {isError ?
                renderError() :

                <ul className="listado-productos">
                    {products.map((producto) => {
                        return (
                            <li key={producto._id}>
                                <Card key={producto._id}>
                                    <Card.Img className="card-img" variant="top" src={SERVER_URL + "uploads/" + producto.img} />
                                    <Card.Body>
                                        <h2 className="title">{producto.nombre}</h2>
                                        <Link className="card_link" to={`/store/producto/id-${producto._id}`}></Link>
                                        <Card.Text className="precio">
                                            ${producto.precio}
                                        </Card.Text>
                                        <Card.Text>
                                            {producto.descripcion}
                                        </Card.Text>
                                    </Card.Body>
                                    {/* <Card.Footer>
                                        <div className="counter-cantidad btn-carrito">
                                            <span className="icon-carrito">
                                            </span>
                                            <div>
                                                {loadingQuantities ? <LoaderMini className="loader-mini" /> :
                                                    <>
                                                        <Button variant="danger" onClick={() => handleSubstractItemToCart(producto._id)} disabled={loadingQuantities}>-</Button>

                                                        {checkQuantity(producto._id) || 0}

                                                        <Button variant="success" onClick={() => handleAddItemToCart(producto._id)} disabled={loadingQuantities}>+</Button>
                                                    </>
                                                }
                                            </div>
                                        </div>
                                    </Card.Footer> */}
                                </Card>
                            </li>
                        );
                    })}
                </ul>
            }
        </div>

    )
}


