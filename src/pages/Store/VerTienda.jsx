import "./VerTienda.css";

import React, { useEffect, useState } from "react";
import * as productosService from "../../services/productos.service";

import { useQuery } from "react-query";
import Loader from "../../components/basics/Loader";
import { StoreProduct } from "../../components/productos/StoreProduct/StoreProduct";


export function VerTienda() {
    const fetchProducts = async () => {
        const result = await productosService.find();
        return JSON.parse(JSON.stringify(result));
    }

    useEffect(() => {
        return () => {
            
        }
    }, []);

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
        <div className="cont-list-productos">
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
            }
        </div>

    )
}


