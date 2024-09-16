import "./HistorialCompras.css";
import * as comprasService from "../../services/compras.service";

import { useParams } from "react-router-dom";

import { DateTime } from "luxon";
import { useQuery } from "react-query";
import Loader from "../../components/basics/Loader";



export function HistorialCompras() {
    const params = useParams();

    const fetchPurchases = async () => {
        const result = await comprasService.findByIdUser(params?.idUsuario);
        return JSON.parse(JSON.stringify(result));
    }

    const { data: purchases, isLoading, isError, refetch } = useQuery(
        'purchases',
        fetchPurchases,
        {
            staleTime: 10000,
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
                <div className="cont-historial">
                    {purchases.map((compra, index) => (
                        <div key={index} className="cont-compra-fecha">
                            <p className="fecha">{DateTime.fromISO(compra.created_at).toLocaleString(DateTime.DATETIME_FULL)}</p>
                            <ul className="cont-compra">
                                <li className="item-compra">
                                    <div className="cont-resumen">

                                        <h2>Resumen</h2>
                                        <p><span className="negritas">Importe total:</span> ${compra.totalCost}</p>
                                        <p><span className="negritas">Cantidad total:</span> {compra.totalQuantity} artículos</p>
                                        <p><span className="negritas">Demora estimada:</span> {compra.totalDelay} días</p>
                                    </div>

                                    <div className="cont-articulos">
                                        <h2>Artículos</h2>
                                        <ul>
                                            {compra.productos.map((producto, subIndex) => (
                                                <li key={`${index}-${subIndex}`}>
                                                    <div className="d-flex justify-content-between align-items-center">

                                                        <div>
                                                            <h3 className="mb-0 me-2 d-inline">{producto.title}</h3><span className="badge text-bg-primary">{producto.material}</span>
                                                        </div>
                                                        <div><span>{producto.quantity} x </span><span>${producto.unit_price}</span></div>
                                                    </div>
                                                    <p>{producto.description}</p>

                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    ))}
                </div>
            }
        </>
    );

}
