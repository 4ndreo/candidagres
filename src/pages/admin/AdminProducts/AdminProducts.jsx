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

    const [request, setRequest] = useState({
        page: 0,
        limit: 10,
        filter: { field: undefined, value: undefined },
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
                </div>
            }
            <Paginator props={{ pages: products.pages, count: products.count, page: request.page, limit: request.limit, handlePaginate: handlePaginate, handlePaginateNext: handlePaginateNext, handlePaginatePrevious: handlePaginatePrevious }} />

        </div>
    );
}
