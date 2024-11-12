import "./FormProduct.css";
import React, { useEffect, useState } from "react";
import * as productosService from "../../services/productos.service";
import * as mediaService from "../../services/media.service";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../basics/Loader";

// Cloudinary
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";

// const imageMimeType = /image\/(png|jpg|jpeg)/i;

export default function FormProduct({ props }) {

  // const [imgName, setImgName] = useState('');


  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileDataURL, setFileDataURL] = useState(null);

  let navigate = useNavigate();
  const params = useParams();

  const [initialForm, setInitialForm] = useState();
  const [form, setForm] = useState({});
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});


  async function fetchProduct(id) {
    setIsLoading(true);

    await productosService
      .findById(id)
      .then((producto) => {
        delete producto._id
        setInitialForm(producto);
        setIsLoading(false)
      })
      .catch((err) => setError(err));
  }

  useEffect(() => {
    if (params?.id) {
      fetchProduct(params?.id);
    }
  }, [params?.id]);

  useEffect(() => {
    let fileReader, isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileDataURL(result)
        }
      }
      fileReader.readAsDataURL(file);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    }

  }, [file]);

  function handleSubmit(e) {
    e.preventDefault();
    let body = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      body.append(key, value);
    });
    if (file) body.append('file', file);
    if (params?.id) {
      productosService
        .update(params?.id, body)
        .then((resp) => {
          if (!resp.err) {
            props.setShowToast({ show: true, title: 'Éxito', message: 'El producto se ha modificado.', variant: 'success', position: 'top-end' });
            navigate("/admin/products");
          } else {
            setErrors(resp.err);
          }
        }).catch((err) => props.setShowToast({ show: true, title: 'Error al modificar el producto', message: 'Inténtelo de nuevo más tarde', variant: 'danger', position: 'top-end' }));

    } else {
      productosService
        .create(body)
        .then((resp) => {
          if (!resp.err) {
            props.setShowToast({ show: true, title: 'Éxito', message: 'El producto se ha creado.', variant: 'success', position: 'top-end' });
            navigate("/admin/products");
          } else {
            setErrors(resp.err);
          }
        }).catch((err) => props.setShowToast({ show: true, title: 'Error al crear el producto', message: 'Inténtelo de nuevo más tarde', variant: 'danger', position: 'top-end' }));
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
  }

  const changeHandler = (e) => {
    const { name } = e.target;

    setErrors({
      ...errors,
      [name]: '',
    });
    const file = e.target.files[0];
    setFile(file);
  }

  const renderError = () => {
    return (
      <div className="alert alert-danger" role="alert">
        {error.message}
      </div>
    )
  }

  const renderImage = () => {
    const cld = new Cloudinary({ cloud: { cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME } });
    const img = cld
      .image(`products/${initialForm?.img}`)
      .format('auto')
      .quality('auto')
      .resize(auto().gravity(autoGravity()));
    return (
      <AdvancedImage cldImg={img} className="product-image img-fluid rounded-3" alt={initialForm?.description} />
    )
  }

  if (isLoading) {
    return <Loader></Loader>
  }

  // if (product) {
  return (
    <div className="container cont-admin-form-products">
      <h1>{params?.id ? 'Editar' : 'Crear'} - {props.title}</h1>
      {error ? renderError() :
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="title" className="form-label">Nombre</label>
            <input
              className={"form-control w-100 " + (errors.title ? 'is-invalid' : '')}
              type="text"
              id="title"
              name="title"
              placeholder="Elegí un título llamativo"
              defaultValue={initialForm?.title}
              required
              onChange={(e) => handleChange(e)}
            />
            <small className="form-text text-danger">
              {errors.title}
            </small>
          </div>
          <div>
            <label htmlFor="description" className="form-label">Descripción</label>
            <textarea
              className={"form-control w-100 " + (errors.description ? 'is-invalid' : '')}
              rows={4}
              id="description"
              type="text"
              name="description"
              placeholder="Redactá una descripción detallada sobre tu producto. Podés incluir detalles de uso, materiales, etc."
              defaultValue={initialForm?.description}
              required
              onChange={handleChange}
            ></textarea>
            <small className="form-text text-danger">
              {errors.description}
            </small>
          </div>
          <div className="d-flex flex-column flex-md-row gap-3">

            <div className="w-100">
              <label htmlFor="estimated_delay" className="form-label">Demora esperada</label>
              <div className="input-group">
                <input
                  className={"form-control " + (errors.estimated_delay ? 'is-invalid' : '')}
                  id="estimated_delay"
                  name="estimated_delay"
                  type="number"
                  min={1}
                  defaultValue={parseInt(initialForm?.estimated_delay)}
                  required
                  onChange={handleChange}

                />
                <div className="input-group-append">
                  <span className="input-group-text">días</span>
                </div>
              </div>
              <small className="form-text text-danger">
                {errors.estimated_delay}
              </small>
            </div>
            <div className="w-100">
              <label htmlFor="price" className="form-label">Precio</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">$</span>
                </div>
                <input
                  className={"form-control " + (errors.price ? 'is-invalid' : '')}
                  id="price"
                  name="price"
                  type="number"
                  min={0}
                  defaultValue={parseInt(initialForm?.price)}
                  onChange={handleChange}
                  required
                />
                <div className="input-group-append">
                  <span className="input-group-text">.00</span>
                </div>
              </div>
              <small className="form-text text-danger">
                {errors.price}
              </small>
            </div>
            <div className=" w-100">
              <label htmlFor="material" className="form-label">Material</label>
              <input
                className={"form-control w-100 " + (errors.material ? 'is-invalid' : '')}
                id="material"
                type="text"
                name="material"
                defaultValue={initialForm?.material}
                required
                onChange={handleChange}
              />
              <small className="form-text text-danger">
                {errors.material}
              </small>
            </div>
          </div>
          <div>
            <label htmlFor="img" className="form-label">{params?.id ? 'Cambiar' : 'Subir'} Imagen:</label>
            <input
              className={"form-control w-100 " + (errors.img ? 'is-invalid' : '')}
              id="img"
              type="file"
              name="img"
              accept='.png, .jpg, .jpeg'
              onChange={changeHandler}
            />
            <small className="form-text text-danger">
              {errors.img}
            </small>
          </div>
          <div>
            <div className="img-preview-wrapper">
              {fileDataURL ?
                <>
                  <label className="form-label d-block">Nueva imagen:</label>
                  <img src={fileDataURL} className="product-image img-fluid rounded-3" alt={initialForm?.description} />
                </>
                :

                params?.id &&
                <>
                  <label className="form-label d-block">Imagen actual:</label>
                  {initialForm &&
                    renderImage()
                  }
                  {/* <img src={SERVER_URL + "uploads/" + initialForm?.img} className="product-image img-fluid rounded-3" alt={initialForm?.description} /> */}
                </>

              }
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Guardar producto
          </button>
        </form>
      }
    </div>
  );
  // }
}
