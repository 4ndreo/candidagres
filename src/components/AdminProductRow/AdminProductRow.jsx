import { useContext, useState } from 'react';
import './AdminProductRow.css';
import { Modal } from "react-bootstrap";
import { Link } from 'react-router-dom';
import * as productosService from "../../services/productos.service";
import * as mediaService from "../../services/media.service";
import { AuthContext } from '../../App';

// Cloudinary
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";

export default function AdminProductRow({ props }) {
  const value = useContext(AuthContext);

  const [deleting, setDeleting] = useState();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (selected) => { setShow(true); setDeleting(selected) };

  function handleSelectedDelete(item) {
    setDeleting(item);
  }

  async function handleConfirmDelete(item) {
    try {
      await productosService.remove(item._id)
      await mediaService.removeImage(item.img)
      props.setShowToast({ show: true, title: 'Éxito', message: 'El producto se ha eliminado', variant: 'success', position: 'top-end' });
      props.refetch();
    } catch (err) {
      props.setShowToast({ show: true, title: 'Error al eliminar el producto', message: 'Inténtelo de nuevo más tarde', variant: 'danger', position: 'top-end' });

    }
  }

  const renderImage = (item) => {
    const cld = new Cloudinary({ cloud: { cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME } });
    const img = cld
      .image(`products/${item.img}`)
      .format('auto')
      .quality('auto')
      .resize(auto().gravity(autoGravity()));
    return (
      <AdvancedImage cldImg={img} className="product-image img-fluid rounded-3" alt={item?.description} />
    )
  }

  return (
    <>
      <tr className="cont-admin-products-row">
        {props.cols.map((col, index) => {
          switch (col.type) {
            case 'actions':
              return (
                <td key={index}>
                  <div className="d-flex gap-3 align-items-center justify-content-center">
                    {props.showEdit && <Link to={props.item._id} aria-label="Editar">
                      <span className="pi pi-pen-to-square text-primary"></span>
                    </Link>}
                    {props.showDelete && <button
                      onClick={() => { handleShow(); handleSelectedDelete(props.item); }}
                      className="btn p-0"
                      type="button"
                      aria-label="Eliminar">
                      <span className="pi pi-trash text-danger"></span>
                    </button>}
                  </div>
                </td>
              )
            case 'string':
              return <td key={index} className="text-left"><span className="d-flex justify-content-center">{props.item[col.field]}</span></td>
            case 'number':
              return <td key={index} className="text-center">{parseInt(props.item[col.field])}</td>
            case 'currency':
              return <td key={index} className="text-center">${parseInt(props.item[col.field])}</td>
            case 'created_by':
              return (
                value.currentUser?.role === 1 &&
                <td key={index} className="text-center">{props.item.user.email}</td>
              )
            case 'image':
              return (<td key={index} className="text-center">
                {renderImage(props.item)}
              </td>)
            // case 'date':
            default:
              return (<td key={index} className="text-center">{props.item[col.field]}</td>)
          }
        }
        )}
      </tr>
      <Modal show={show} onHide={handleClose} size="lg" variant="white" className="modal-delete">
        <Modal.Header className="modal-title" closeButton>
          <Modal.Title className="negritas">¿Seguro querés eliminar "{deleting?.title}"?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><span className="negritas">Esta acción es irreversible</span></p>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => { handleClose(); }}
            className="btn btn-link btn-close-link"
            type="button"
            data-toggle="tooltip"
            data-placement="top">
            <span>Cerrar</span>
          </button>
          <button
            onClick={() => { handleConfirmDelete(deleting); handleClose(); }}
            className="btn btn-danger btn-eliminar"
            type="button"
            data-toggle="tooltip"
            data-placement="top">
            <span>Eliminar definitivamente</span>
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

// export default Header;
