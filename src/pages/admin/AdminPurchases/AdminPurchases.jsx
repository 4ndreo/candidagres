// Styles
import "./AdminPurchases.css";
import "../css/AdminTable.css";

// React
import { useQuery } from "react-query";
import React, { useEffect, useRef, useState } from "react";

// Services
import * as purchasesService from "../../../services/purchases.service";

// Components
import Loader from "../../../components/basics/Loader";
import AdminPurchaseRow from "../../../components/AdminPurchaseRow/AdminPurchaseRow";
import Paginator from "../../../components/Paginator/Paginator";

// External Libraries
import { Button, ButtonGroup, Dropdown, Form } from "react-bootstrap";
import { DateTime } from "luxon";

export default function AdminPurchases({ props }) {
    const cols = [
        { field: 'actions', header: 'Acciones', type: 'actions' },
        { field: 'user', header: 'Usuario', type: 'relation', relationField: 'email', relationTable: 'users' },
        { field: 'totalCost', header: 'Importe total', type: 'number' },
        { field: 'totalQuantity', header: 'Cantidad items', type: 'number' },
        { field: 'totalDelay', header: 'Demora estimada (días)', type: 'number' },
        { field: 'created_at', header: 'Fecha compra', type: 'date' },
        { field: 'delivered_at', header: 'Fecha entrega', type: 'date' },
    ]

    // const [showToast, setShowToast] = useState(null);
    const [request, setRequest] = useState({
        page: 0,
        limit: 10,
        filter: [{ "field": "created_at", "value": { "date_from": DateTime.fromJSDate(new Date()).minus({ month: 1 }).toFormat('yyyy-MM-dd'), "date_to": DateTime.fromJSDate(new Date()).toFormat('yyyy-MM-dd') } }],
        sort: { field: 'created_at', direction: -1 },
    });

    const fetchPurchases = async (request) => {
        const result = await purchasesService.findQuery({ ...request, filter: JSON.stringify(request.filter), sort: JSON.stringify(request.sort) });
        return result[0];
    }

    const { data: purchases, isLoading, isError, error, refetch, isRefetching } = useQuery(
        'purchasesAdmin',
        () => fetchPurchases(request),
        {
            staleTime: 300000,
            retry: 2,
        }
    );

    useEffect(() => {
        refetch();
    }, [request, refetch]);


    function handleFilter(field, value) {
        if (request.filter.some(x => x.field === field)) {
            request.filter[request.filter.findIndex(x => x.field === field)] = { field, value }
        } else {
            request.filter.push({ field, value })
        }

        setRequest({ ...request, page: 0 });
    }

    function handleFilterDate(field, value) {
        if (request.filter.some(x => x.field === field)) {
            request.filter[request.filter.findIndex(x => x.field === field)] = { field, value: { date_from: value.date_from.value, date_to: value.date_to.value } }
        } else {
            request.filter.push({ field, value: { date_from: value.date_from.value, date_to: value.date_to.value } })
        }

        setRequest({ ...request, page: 0 });
    }

    function handleSort(field) {
        const parsedSort = request.sort
        if (parsedSort.field === field) {
            setRequest({ ...request, page: 0, sort: { field, direction: parsedSort.direction === 1 ? -1 : 1 } });
        } else {
            setRequest({ ...request, page: 0, sort: { field, direction: 1 } });
        }
    }

    function handleClear(field) {
        request.filter[request.filter.findIndex(x => x.field === field)] = {}
        setRequest({ ...request });
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

    const dropdownMenuRef = useRef(null);

    const toggleDropdown = () => {
        if (dropdownMenuRef.current) {
            const isShown = dropdownMenuRef.current.classList.contains('show');
            if (isShown) {
                dropdownMenuRef.current.classList.remove('show');
            } else {
                dropdownMenuRef.current.classList.add('show');
            }
        }
    };
    const renderCols = (col) => {
        switch (col.type) {
            case 'string':
                return (
                    <th className="col-header align-middle" scope="col" key={col.field}>
                        <Dropdown as={ButtonGroup}>
                            <Button className="col-label" variant="link" onClick={(e) => { e.preventDefault(); handleSort(col.field) }}>
                                <span>{col.header}</span>
                                {request.sort.field === col.field && <span className={"pi pi-sort-alpha" + (request.sort.direction === 1 ? "-down" : "-down-alt")}></span>}
                            </Button>

                            <Dropdown.Toggle split as={request.filter.some(x => x.field === col.field) ? renderSelectedFilterMenu : renderFilterMenu} />


                            <Dropdown.Menu className="cont-search">
                                <Form onSubmit={(e) => { e.preventDefault(); handleFilter(col.field, e.target.filter.value) }}>
                                    <Form.Control type="text" name="filter" autoFocus placeholder={"Buscar por " + col.header} />
                                    <div className="d-flex mt-2 justify-content-end gap-2">
                                        <Button variant="outline-secondary" onClick={(e) => { e.preventDefault(); handleClear(col.field) }}>Limpiar</Button>
                                        <Button variant="primary" type="submit">Aplicar</Button>
                                    </div>
                                </Form>
                            </Dropdown.Menu>
                        </Dropdown>
                    </th>
                )
            case 'date':
                return (
                    <th className="col-header align-middle" scope="col" key={col.field}>
                        <Dropdown as={ButtonGroup} >
                            <Button className="col-label" variant="link" onClick={(e) => { e.preventDefault(); handleSort(col.field) }}>
                                <span>{col.header}</span>
                                {request.sort.field === col.field && <span className={"pi pi-sort-alpha" + (request.sort.direction === 1 ? "-down" : "-down-alt")}></span>}
                            </Button>

                            <Dropdown.Toggle id="dropdown-basic" split as={request.filter.some(x => x.field === col.field) ? renderSelectedFilterMenu : renderFilterMenu} />


                            <Dropdown.Menu className="cont-search" ref={dropdownMenuRef}>
                                <Form onSubmit={(e) => { e.preventDefault(); handleFilterDate(col.field, e.target); toggleDropdown() }}>
                                    <small>Fecha desde:</small>
                                    <Form.Control type="date" defaultValue={DateTime.fromJSDate(new Date()).minus({ month: 1 }).toFormat('yyyy-MM-dd')} name="date_from" autoFocus placeholder="Fecha desde" className="mb-1" />
                                    <small>Fecha hasta:</small>
                                    <Form.Control type="date" defaultValue={DateTime.fromJSDate(new Date()).toFormat('yyyy-MM-dd')} name="date_to" placeholder="Fecha desde" />
                                    <div className="d-flex mt-2 justify-content-end gap-2">
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
                    <th className="col-header align-middle" scope="col" key={col.field}>
                        <Dropdown as={ButtonGroup}>
                            <Button className="col-label" variant="link" onClick={(e) => { e.preventDefault(); handleSort(col.field) }}>
                                <span>{col.header}</span>
                                {request.sort.field === col.field && <span className={"pi pi-sort-numeric" + (request.sort.direction === 1 ? "-down" : "-down-alt")}></span>}
                            </Button>
                        </Dropdown>
                    </th>
                )
            // case 'date':
            default:
                return (
                    <th scope="col" className="col-header align-middle" key={col.field}>{col.header}</th>
                )

        }
    }

    if (isRefetching || isLoading) {
        return <Loader></Loader>
    }

    const renderFilterMenu = React.forwardRef(({ onClick }, ref) => (
        <Button
            className="btn-filter"
            variant="secondary-outline"
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(() => toggleDropdown());
            }}
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
                onClick(() => toggleDropdown());
            }}
        >
            <span className="pi pi-filter-fill"></span>
        </Button>
    ));

    return (
        <div className="cont-admin-purchases admin-table">
            <div className="d-md-flex justify-content-between align-items-baseline mb-3">

                <div>

                    <h1>Administrar Compras</h1>
                    <p>Para confirmar la entrega de un pedido, hacé click en el icono de "Confirmar entrega" de la columna "Acciones".</p>
                </div>
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
                                {purchases?.data.length > 0 ?
                                    purchases?.data?.map((item) => {
                                        return <AdminPurchaseRow props={{ item: item, refetch: refetch, cols: cols, showDelivered: true, showView: true, setShowToast: props.setShowToast }} key={item._id} />
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
            {purchases?.data.length > 0 &&
                <Paginator props={{ pages: purchases?.pages ?? 0, count: purchases?.count ?? 0, page: request.page, limit: request.limit, handlePaginate: handlePaginate, handlePaginateNext: handlePaginateNext, handlePaginatePrevious: handlePaginatePrevious }} />

            }

        </div>
    );
}
