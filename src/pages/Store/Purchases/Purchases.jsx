import "./Purchases.css";
import * as comprasService from "../../../services/compras.service";

import { useParams } from "react-router-dom";

import { useQuery } from "react-query";
import Loader from "../../../components/basics/Loader";
import { Purchase } from "../../../components/Purchase/Purchase";



export function Purchases() {
    const params = useParams();

    const fetchPurchases = async () => {
        const result = await comprasService.findByIdUser(params?.idUsuario);
        return result;
    }

    const { data: purchases, isLoading, isError, error, refetch } = useQuery(
        'purchases',
        fetchPurchases,
        {
            staleTime: Infinity,
            retry: 2,
        }
    );

    if (isLoading) {
        return <Loader></Loader>
    }

    return (
        <>
            <h1 className="mb-4">Historial de compras</h1>
            {isError ?
                <div className="alert alert-danger" role="alert">
                    Error al cargar los registros. Inténtelo de nuevo más tarde.
                </div> :
                <ul className="cont-purchases">
                    {purchases.map((compra, index) => (
                        <li key={index}>
                            <Purchase props={{compra: compra, index: index}}></Purchase>
                        </li>
                    ))}
                </ul>
            }
        </>
    );

}
