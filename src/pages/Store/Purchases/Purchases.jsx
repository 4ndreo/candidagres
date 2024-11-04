import "./Purchases.css";
import * as comprasService from "../../../services/compras.service";

import { useParams } from "react-router-dom";

import { useQuery } from "react-query";
import Loader from "../../../components/basics/Loader";
import { Purchase } from "../../../components/Purchase/Purchase";



export default function Purchases() {
    const params = useParams();

    const fetchPurchases = async () => {
        const result = await comprasService.findByIdUser(params?.idUsuario);
        return result;
    }

    const { data: purchases, isLoading, isError, error, refetch } = useQuery(
        'purchases',
        fetchPurchases,
        {
            staleTime: 1000,
            retry: 2,
        }
    );

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

                purchases.length > 0 ? 
                <ul className="cont-purchases">
                    {purchases.map((compra, index) => (
                        <li key={index}>
                            <Purchase props={{compra: compra, index: index}}></Purchase>
                        </li>
                    ))}
                </ul> 
                : <p>Aún no hiciste ninguna compra.</p>
            
            }
        </>
    );

}
