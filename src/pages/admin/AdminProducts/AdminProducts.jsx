// Styles
import "./AdminProducts.css";

// React
import { Link } from "react-router-dom";
import { useQuery } from "react-query";

// Services
import * as productosService from "../../../services/productos.service";

// Components
import Loader from "../../../components/basics/Loader";
import AdminProductRow from "../../../components/AdminProductRow/AdminProductRow";


export default function AdminProducts() {
    const fetchPurchases = async () => {
        return await productosService.find();
    }

    const { data: products, isLoading, isError, error, refetch } = useQuery(
        'products',
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
                                    <th scope="col">DEMORA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((item) => {
                                    return <AdminProductRow props={{ item: item, refetch: refetch }} key={item._id} />
                                })}
                            </tbody>
                        </table>
                    </div>
                    <nav aria-label="pagination">
                        <ul className="pagination  justify-content-center">
                            <li className="page-item">
                                <a className="page-link" href="#" aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>
                            <li className="page-item"><a className="page-link" href="#">1</a></li>
                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                            <li className="page-item"><a className="page-link" href="#">3</a></li>
                            <li className="page-item">
                                <a className="page-link" href="#" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            }

        </div>
    );
}
