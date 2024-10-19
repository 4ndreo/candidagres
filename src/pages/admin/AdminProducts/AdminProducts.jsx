// Styles
import "./AdminProducts.css";
import "../css/AdminTable.css";

// React
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import React, { useContext, useEffect, useState } from "react";

// Services
import * as productosService from "../../../services/productos.service";

// Components
import Loader from "../../../components/basics/Loader";
import AdminProductRow from "../../../components/AdminProductRow/AdminProductRow";
import Paginator from "../../../components/Paginator/Paginator";

// External Libraries
import { Button, ButtonGroup, Dropdown, Form } from "react-bootstrap";
import CustomToast from "../../../components/basics/CustomToast/CustomToast";
import { AuthContext } from "../../../App";


export default function AdminProducts() {
    const value = useContext(AuthContext);

    const cols = [
        { field: 'actions', header: 'Acciones', type: 'actions' },
        { field: 'img', header: 'Imagen', type: 'image' },
        { field: 'title', header: 'Título', type: 'string' },
        { field: 'description', header: 'Descripción', type: 'string' },
        { field: 'material', header: 'Material', type: 'string' },
        { field: 'price', header: 'Precio', type: 'currency' },
        { field: 'estimated_delay', header: 'Demora', type: 'number' },
        { field: 'created_by', header: 'Creado por', type: 'created_by' },
    ]

    const [showToast, setShowToast] = useState(null);
    // const [filterInput, setFilterInput] = useState(undefined)
    const [request, setRequest] = useState({
        page: 0,
        limit: 10,
        filter: JSON.stringify({ field: undefined, value: undefined }),
        sort: JSON.stringify({ field: undefined, direction: 1 }),
    });

    const fetchProducts = async (request) => {
        const result = await productosService.findQuery(request);
        return result[0];
    }

    const { data: products, isLoading, isError, error, refetch } = useQuery(
        'products',
        () => fetchProducts(request),
        {
            staleTime: Infinity,
            retry: 2,
        }
    );

    useEffect(() => {
        refetch();
    }, [request]);


    function handleFilter(field, value) {
        setRequest({ ...request, filter: JSON.stringify({ field, value }) });
    }

    function handleSort(field) {
        const parsedSort = JSON.parse(request.sort)
        if (parsedSort.field === field) {
            setRequest({ ...request, sort: JSON.stringify({ field, direction: parsedSort.direction === 1 ? -1 : 1 }) });
        } else {
            setRequest({ ...request, sort: JSON.stringify({ field, direction: 1 }) });
        }
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
                            <Button className="col-label" variant="link" onClick={(e) => { e.preventDefault(); handleSort(col.field) }}>
                                <span>{col.header}</span>
                                {JSON.parse(request.sort).field === col.field && <span className={"pi pi-sort-alpha" + (JSON.parse(request.sort).direction === 1 ? "-down" : "-down-alt")}></span>}
                            </Button>

                            <Dropdown.Toggle split as={JSON.parse(request.filter)?.field === col.field ? renderSelectedFilterMenu : renderFilterMenu} />


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
            case 'number':
            case 'currency':
                return (
                    <th className="col-header" scope="col" key={col.field}>
                        <Dropdown as={ButtonGroup}>
                            <Button className="col-label" variant="link" onClick={(e) => { e.preventDefault(); handleSort(col.field) }}>
                                <span>{col.header}</span>
                                {JSON.parse(request.sort).field === col.field && <span className={"pi pi-sort-numeric" + (JSON.parse(request.sort).direction === 1 ? "-down" : "-down-alt")}></span>}
                            </Button>
                        </Dropdown>
                    </th>
                )
            // case 'date':
            case 'created_by':
                return (
                    value.currentUser?.role === 1 &&
                    <th scope="col" key={col.field}>{col.header}</th>
                )
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
            variant="secondary-outline"
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }
            }
        >
            <span className={"pi pi-filter"}></span>
        </Button>
    ));
    const renderSelectedFilterMenu = React.forwardRef(({ onClick }, ref) => (
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
            <span className="pi pi-filter-fill"></span>
        </Button>
    ));

    return (
        <div className="cont-admin-products admin-table">
            <div className="d-md-flex justify-content-between align-items-center mb-3">

                <h1>Administrar Productos</h1>
                <Link to="new" className="btn btn-primary btn-icon">
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
                                </tr>
                            </thead>
                            <tbody>
                                {products?.data.length > 0 ?
                                    products?.data?.map((item) => {
                                        return <AdminProductRow props={{ item: item, refetch: refetch, cols: cols, showEdit: true, showDelete: true, setShowToast: setShowToast }} key={item._id} />
                                    })
                                    :
                                    <tr>
                                        <td colSpan={cols.length}>No hay registros que coincidan con esa búsqueda. Intentá ampliar el criterio.</td>
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
            <CustomToast props={{ data: showToast, setShowToast: setShowToast }} />

        </div>
    );
}
