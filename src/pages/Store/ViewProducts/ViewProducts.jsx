// Styles
import "./ViewProducts.css";

// React
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

// Services
import * as productsService from "../../../services/products.service";

// Components
import Loader from "../../../components/basics/Loader";
import StoreProduct from "../../../components/StoreProduct/StoreProduct";
import Paginator from "../../../components/Paginator/Paginator";

export default function ViewProducts() {

    const [request, setRequest] = useState({
        page: 0,
        limit: 12,
        filter: [{ field: 'undefined', value: 'undefined' }],
        sort: { field: 'undefined', direction: 1 },
    });

    const fetchProducts = async (request, signal) => {
        const result = await productsService.findQuery({ ...request, filter: JSON.stringify(request.filter), sort: JSON.stringify(request.sort) }, signal);
        return result[0];
    }

    const { data: products, isLoading, isError, error, refetch } = useQuery(
        'products',
        async ({ signal }) => fetchProducts(request, signal),
        {
            staleTime: 10000,
            retry: 2,
        }
    );

    useEffect(() => {
        refetch();
    }, [request, refetch]);

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
        <>
            <div className="cont-list-products">
                <h1 className="mb-4">Productos</h1>
                {isError ?
                    renderError() :

                    <ul>
                        {products?.data?.map((item) => {
                            return (
                                <li key={item._id}>
                                    <StoreProduct props={{ item }}></StoreProduct>
                                </li>
                            );
                        })}
                    </ul>
                }
            </div>
            {products?.data.length > 0 &&
                <Paginator props={{ pages: products?.pages ?? 0, count: products?.count ?? 0, page: request.page, limit: request.limit, handlePaginate: handlePaginate, handlePaginateNext: handlePaginateNext, handlePaginatePrevious: handlePaginatePrevious }} />

            }
        </>
    )
}


