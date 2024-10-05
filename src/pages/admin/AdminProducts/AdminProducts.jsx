// Styles
import "./AdminProducts.css";

// React
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";

// Services
import * as productosService from "../../../services/productos.service";

// Components
import Loader from "../../../components/basics/Loader";
import AdminProductRow from "../../../components/AdminProductRow/AdminProductRow";
import Paginator from "../../../components/Paginator/Paginator";


export default function AdminProducts() {
    const [activePage, setActivePage] = useState(1);
    const [request, setRequest] = useState({
        page: 0,
        limit: 2,
        filter: { field: undefined, value: undefined },
        sort: undefined,
        order: 1,
    });

    const fetchPurchases = async (request) => {
        const result = await productosService.findQuery(request);
        return result[0];
    }

    const { data: products, isLoading, isError, error, refetch } = useQuery(
        ['products', request],
        () => fetchPurchases(request),
        {
            staleTime: 1000,
            retry: 2,
        }
    );

    const visiblePages = 3; // show 5 pages at a time
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(visiblePages + 1);
    

    function handlePaginate(page) {
        setActivePage(page + 1);
        setRequest({ ...request, page: request.limit * page }); //old
    }

    function handlePaginatePrevious(page) {
        if (page > 1) {
            setActivePage(prev => 0 < prev - 1 ? prev - 1 : 1);
            setStartPage((page - 1) % visiblePages === 0 ? page - visiblePages : startPage);
            setEndPage((page - 1) % visiblePages === 0 ? activePage : endPage);
            if (request.page >= request.limit) {
                setRequest({ ...request, page: request.page - request.limit });
            }
        }
    }

    function handlePaginateNext(page) {
        setActivePage(prev => prev + 1 <= products.pages ? prev + 1 : products.pages);
        setStartPage((page) % visiblePages === 0 ? page + 1 : startPage);
        setEndPage(page % visiblePages === 0 ? activePage + visiblePages + 1 : endPage);
        if ((request.page + request.limit) <= products.count) {
            setRequest({ ...request, page: request.page + request.limit });
        }
    }

    const renderError = () => {
        return (
            <div className="alert alert-danger" role="alert">
                {error.message}
            </div>
        )
    }

    if (isLoading) {
        return <Loader></Loader>
    }

    return (
        <div className="cont-admin-products">
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
                                    <th scope="col">Acciones</th>
                                    <th scope="col">Imagen</th>
                                    <th scope="col">Título</th>
                                    <th scope="col">Descripción</th>
                                    <th scope="col">Material</th>
                                    <th scope="col">Precio</th>
                                    <th scope="col">Demora</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.data.map((item) => {
                                    return <AdminProductRow props={{ item: item, refetch: refetch }} key={item._id} />
                                })}
                            </tbody>
                        </table>
                    </div>
                    <Paginator props={{ startPage: startPage, endPage: endPage, activePage: activePage, pages: products.pages, page: request.page, limit: request.limit, handlePaginate: handlePaginate, handlePaginateNext: handlePaginateNext, handlePaginatePrevious: handlePaginatePrevious }} />
                </div>
            }

        </div>
    );
}
