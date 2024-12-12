import { useContext, useState } from 'react';
import './AdminClassRow.css';
import { Modal } from "react-bootstrap";
import { Link } from 'react-router-dom';
import * as classesService from "../../services/classes.service";
import { AuthContext } from '../../App';

export default function AdminClassRow({ props }) {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
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
      await classesService.remove(item._id)
      props.refetch();
      props.setShowToast({ show: true, title: 'Éxito', message: 'La clase se ha eliminado', variant: 'success', position: 'top-end' });
    } catch (err) {
      props.setShowToast({ show: true, title: 'Error al eliminar la clase', message: 'Inténtelo de nuevo más tarde', variant: 'danger', position: 'top-end' });

    }
  }

  return (
    <>
      <tr className="cont-admin-classes-row">
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
                <td key={index} className="text-center">{props.item.user[0].email}</td>
              )
            case 'image':
              return (<td key={index} className="text-center"><img src={SERVER_URL + "uploads/" + props.item[col.field]} className="img-fluid rounded" alt={props.item.descripcion} /></td>)
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
          <p>Eliminar la clase <span className="negritas">eliminará también las comisiones e inscripciones asociadas. <span className="negritas text-danger">Esta acción es irreversible</span></span></p>
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
