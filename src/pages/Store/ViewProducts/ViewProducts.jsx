import "./ViewProducts.css";

// import React, { useEffect, useState } from "react";
import * as productosService from "../../../services/productos.service";

import { useQuery } from "react-query";
import Loader from "../../../components/basics/Loader";
import { StoreProduct } from "../../../components/StoreProduct/StoreProduct";


export default function ViewProducts() {
    const fetchProducts = async (signal) => {
        const result = await productosService.find(signal);
        return result;
    }

    const { data: products, isLoading, isError } = useQuery(
        'products',
        async ({signal}) => fetchProducts(signal),
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
        <div className="cont-list-products">
            <h1 className="mb-4">Productos</h1>
            {isError ?
                renderError() :

                <ul className="listado-productos">
                    {products.map((item) => {
                        return (
                            <li key={item._id}>
                                <StoreProduct props={{ item }}></StoreProduct>
                            </li>
                        );
                    })}
                </ul>

                // TODO: Add paginator and filters
            }
        </div>

    )
}


