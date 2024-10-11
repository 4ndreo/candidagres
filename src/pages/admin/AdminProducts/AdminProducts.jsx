// Styles
import "./AdminProducts.css";
import "../css/AdminTable.css";

// React
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import React, { useEffect, useState } from "react";

// Services
import * as productosService from "../../../services/productos.service";

// Components
import Loader from "../../../components/basics/Loader";
import AdminProductRow from "../../../components/AdminProductRow/AdminProductRow";
import Paginator from "../../../components/Paginator/Paginator";

// External Libraries
import { Button, ButtonGroup, Dropdown, Form } from "react-bootstrap";


export default function AdminProducts() {

    const cols = [
        { field: 'actions', header: 'Acciones', type: 'actions' },
        { field: 'image', header: 'Imagen', type: 'image' },
        { field: 'name', header: 'Título', type: 'string' },
        { field: 'description', header: 'Descripción', type: 'string' },
        { field: 'material', header: 'Material', type: 'string' },
        { field: 'price', header: 'Precio', type: 'currency' },
        { field: 'estimated_delay', header: 'Demora', type: 'number' },
    ]

    const [filterInput, setFilterInput] = useState(undefined)
    const [request, setRequest] = useState({
        page: 0,
        limit: 10,
        filter: JSON.stringify({ field: undefined, value: undefined }),
        sort: undefined,
        order: 1,
    });

    const fetchPurchases = async (request) => {
        const result = await productosService.findQuery(request);
        return result[0];
    }

    const { data: products, isLoading, isError, error, refetch } = useQuery(
        'products',
        () => fetchPurchases(request),
        {
            staleTime: 1000,
            retry: 2,
        }
    );

    useEffect(() => {
        refetch();
    }, [request]);


    function handleFilter(field, value) {
        setRequest({ ...request, filter: JSON.stringify({ field, value }) });
    }

    function handleSort(page) {
        setRequest({ ...request, page: request.limit * page });
    }

    function handleClear(page) {
        setRequest({ ...request, page: request.limit * page });
    }

    function handlePaginate(page) {
        setRequest({ ...request, page: request.limit * page });
    }

    function handlePaginatePrevious() {
        setRequest({ ...request, page: request.page - request.limit });
    }

    function handlePaginateNext() {
        setRequest({ ...request, page: request.page + request.limit });
    }

    const renderError = () => {
        return (
            <div className="alert alert-danger" role="alert">
                {error.message}
            </div>
        )
    }

    const renderCols = (col) => {
        switch (col.type) {
            case 'string':
                return (
                    <th className="col-header" scope="col" key={col.field}>
                        <Dropdown as={ButtonGroup}>
                            <Button className="col-label" variant="link">{col.header}</Button>

                            <Dropdown.Toggle split as={renderFilterMenu} />


                            <Dropdown.Menu className="cont-search">
                                <Form onSubmit={(e) => { e.preventDefault(); handleFilter(col.field, e.target.filter.value) }}>
                                    <Form.Control type="text" name="filter" autoFocus placeholder={"Buscar por " + col.header} />
                                    <div className="d-flex mt-2 justify-content-end gap-2">
                                        <Button variant="outline-secondary" onClick={(e) => { e.preventDefault(); handleFilter(undefined, undefined) }}>Limpiar</Button>
                                        <Button variant="primary" type="submit">Aplicar</Button>
                                    </div>
                                </Form>
                            </Dropdown.Menu>
                        </Dropdown>
                    </th>
                )
            // case 'number':
            // case 'date':
            // case 'currency':
            default:
                return (
                    <th scope="col" key={col.field}>{col.header}</th>
                )

        }
    }

    if (isLoading) {
        return <Loader></Loader>
    }

    const renderFilterMenu = React.forwardRef(({ onClick }, ref) => (
        <Button
            className="btn-filter"
            variant="link"
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }
            }
        >
            <span className="pi pi-filter"></span>
        </Button>
    ));

    return (
        <div className="cont-admin-products admin-table">
            <div className="d-md-flex justify-content-between align-items-center mb-3">

                <h1>Administrar Productos</h1>
                <Link to="producto" className="btn btn-primary btn-icon">
                    <span className="pi pi-plus"></span>Crear un Producto
                </Link>
            </div>
            {isError ?
                renderError() :
                <div className="d-grid">

                    <div className="table-responsive">
                        <table className="table table-hover table-striped ">
                            <thead>
                                <tr>
                                    {cols.map((col) => {
                                        return renderCols(col);
                                    })}
                                    {/* <th scope="col">Acciones</th>
                                    <th scope="col">Imagen</th>
                                    <th scope="col">
                                        <Dropdown as={ButtonGroup}>
                                            <Button className="col-label" variant="link">Título</Button>

                                            <Dropdown.Toggle split as={renderFilterMenu} />


                                            <Dropdown.Menu>
                                                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </th>
                                    <th scope="col">Descripción</th>
                                    <th scope="col">Material</th>
                                    <th scope="col">Precio</th>
                                    <th scope="col">Demora</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {products?.data.length > 0 ?
                                    products?.data?.map((item) => {
                                        return <AdminProductRow props={{ item: item, refetch: refetch }} key={item._id} />
                                    })
                                    :
                                    <tr>
                                        <td colSpan={cols.length}>'No hay registros que coincidan con esa búsqueda. Intentá ampliar el criterio.'</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            }
            {products?.data.length > 0 &&
                <Paginator props={{ pages: products?.pages ?? 0, count: products?.count ?? 0, page: request.page, limit: request.limit, handlePaginate: handlePaginate, handlePaginateNext: handlePaginateNext, handlePaginatePrevious: handlePaginatePrevious }} />

            }

        </div>
    );
}
