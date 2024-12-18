import "./Purchases.css";

import * as purchasesService from "../../../services/purchases.service";

import { useQuery } from "react-query";

import Loader from "../../../components/basics/Loader";
import Purchase from "../../../components/Purchase/Purchase";
import { useEffect, useState } from "react";
import Paginator from "../../../components/Paginator/Paginator";


export default function Purchases() {
    const [request, setRequest] = useState({
        page: 0,
        limit: 5,
        filter: [{ field: 'undefined', value: 'undefined' }],
        sort: { field: 'created_at', direction: -1 },
    });

    const fetchPurchases = async (request) => {
        const result = await purchasesService.findOwn({ ...request, filter: JSON.stringify(request.filter), sort: JSON.stringify(request.sort) });
        return result[0];
    }

    const { data: purchases, isLoading, isError, error, refetch } = useQuery(
        'purchases',
        async ({ signal }) => fetchPurchases(request, signal),
        {
            staleTime: 300000,
            retry: 2,
        }
    );

    function handlePaginate(page) {
        setRequest({ ...request, page: request.limit * page });
    }

    function handlePaginatePrevious() {
        setRequest({ ...request, page: request.page - request.limit });
    }

    function handlePaginateNext() {
        setRequest({ ...request, page: request.page + request.limit });
    }

    useEffect(() => {
        refetch();
    }, [request, refetch]);

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
            <h1 className="mb-4">Historial de compras</h1>
            {isError ?
                renderError() :

                purchases?.data?.length > 0 ?
                    <>
                        <ul className="cont-purchases">
                            {purchases?.data?.map((purchase, index) => (
                                <li key={index}>
                                    <Purchase props={{ purchase: purchase, index: index }}></Purchase>
                                </li>
                            ))}
                        </ul>
                        <Paginator props={{ pages: purchases?.pages ?? 0, count: purchases?.count ?? 0, page: request.page, limit: request.limit, handlePaginate: handlePaginate, handlePaginateNext: handlePaginateNext, handlePaginatePrevious: handlePaginatePrevious }} />
                    </>
                    : <p>Aún no hiciste ninguna compra.</p>

            }

        </>
    );

}
