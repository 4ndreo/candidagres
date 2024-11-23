// Styles
import "./ViewProduct.css";

// React
import { useContext, useState } from "react";
import { AuthContext } from "../../../App";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

// Services
import * as carritoService from "../../../services/carrito.service";
import * as productosService from "../../../services/productos.service";
// Components
import Loader from "../../../components/basics/Loader";

// Cloudinary
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { defaultImage } from "@cloudinary/url-gen/actions/delivery";


export default function ViewProduct(props) {
  const context = useContext(AuthContext);
  const params = useParams();
  const productId = params.id

  const [errorAdding, setErrorAdding] = useState();
  const [adding, setAdding] = useState();
  const [added, setAdded] = useState();
  const [error, setError] = useState(null);


  const fetchProduct = async (id) => {
    const result = await productosService.findById(id);
    return JSON.parse(JSON.stringify(result));
  }

  const { data: product, isLoading, isError } = useQuery(
    'product_' + productId,
    () => fetchProduct(productId),
    {
      staleTime: 60000,
      retry: 2,
      onError: (err) => [setError(err || 'Ha habido un error. Inténtalo de nuevo más tarde.')],
    }
  );

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await carritoService.addToCart(context.currentUser._id, { id: product._id, quantity: 1 }).then((cart) => {
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      });
      setAdding(false);
    } catch (err) {
      setAdding(false);
      setErrorAdding(err);
      setTimeout(() => setErrorAdding(undefined), 3000);
    }
  }

  const renderError = () => {
    return (
      <div className="alert alert-danger" role="alert">
        {error.message}
      </div>
    )
  }

  const renderButtons = () => {
    if (errorAdding) {
      return (
        <button type="submit" className="btn btn-danger d-flex align-items-center justify-content-center gap-2">
          <span className="pi pi-times"></span>
          <span>Error al agregar</span>
        </button>
      )
    }

    if (added) {
      return (
        <button type="submit" className="btn btn-success d-flex align-items-center justify-content-center gap-2">
          <span className="pi pi-check"></span>
          <span>Agregado al carrito</span>
        </button>
      )
    }

    if (adding) {
      return (
        <button type="submit" className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2" disabled>
          <span className="pi pi-spin pi-spinner"></span>
          <span>Agregando...</span>
        </button>
      )
    }

    return (
      <button type="submit" className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2" onClick={handleAddToCart}>
        <span className="pi pi-shopping-cart"></span>
        <span>Agregar al carrito</span>
      </button>
    )
  }

  const renderImage = (item) => {
    const cld = new Cloudinary({ cloud: { cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME } });
    const img = cld
      .image(item?.img ? `products/${item?.img}` : 'placeholder-image')
      .format('auto')
      .quality('auto')
      .resize(auto().gravity(autoGravity()))
      .delivery(defaultImage("placeholder-image.jpg"));
    return (
      <AdvancedImage cldImg={img} className="product-image img-fluid rounded-3" alt={item?.description} />
    )
  }

  if (isLoading) {
    return <Loader></Loader>
  }

  return (
    <div className="row g-5 cont-view-product">
      {isError ?
        renderError()
        :
        <>
          <div className="col-md-6">
            {renderImage(product)}
          </div>
          <div className="col-md-6">
            <div className="row g-0 h-100 align-content-between">
              <div>
                <p className="text-body-secondary">Demora estimada: {product.estimated_delay} días</p>
                <h1 className="card-title">{product.title}</h1>
                <p className="card-price">${product.price}</p>
                <p className="negritas">Lo que deberías saber de este artículo:</p>
                <p className="card-text">{product.description}</p>
                <p>Material: <span className="badge text-bg-primary">{product.material}</span></p>
                <p>Artesano: <span className="negritas">{product.user.first_name} {product.user.last_name}</span></p>
              </div>
              {renderButtons()}
            </div>
          </div>
        </>
      }
    </div>
  );
}
