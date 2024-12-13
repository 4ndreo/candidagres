import { useContext, useState } from 'react';
import './AdminPurchaseRow.css';
import { Form, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from 'react-router-dom';
import * as purchasesService from "../../services/purchases.service";
import * as mediaService from "../../services/media.service";
import { AuthContext } from '../../App';
import { DateTime } from 'luxon';

// Cloudinary
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { defaultImage } from '@cloudinary/url-gen/actions/delivery';

export default function AdminPurchaseRow({ props }) {
  const [delivering, setDelivering] = useState();
  const [viewing, setViewing] = useState();
  const [show, setShow] = useState(false);
  const [showView, setShowView] = useState(false);
  const [errors, setErrors] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = (selected) => { setShow(true); setDelivering(selected) };

  function handleSelectedDeliver(item) {
    setDelivering(item);
  }

  async function handleConfirmDelivery(item) {
    try {
      const delivered = await purchasesService.setDelivered(item);
      if (delivered.err) {
        setErrors(delivered.err);
      } else {
        handleClose();
        props.setShowToast({ show: true, title: 'Éxito', message: 'La compra se marcó como entregada', variant: 'success', position: 'top-end' });
        props.refetch();
      }
    } catch (err) {
      props.setShowToast({ show: true, title: 'Error al marcar la compra como entregada', message: 'Inténtelo de nuevo más tarde', variant: 'danger', position: 'top-end' });
      handleClose();
    }
  }

  const renderImage = (item) => {
    const cld = new Cloudinary({ cloud: { cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME } });
    const img = cld
      .image(item?.img ? `purchases/${item?.img}` : 'placeholder-image')
      .format('auto')
      .quality('auto')
      .resize(auto().gravity(autoGravity()))
      .delivery(defaultImage("placeholder-image.jpg"));
    return (
      <AdvancedImage cldImg={img} className="purchase-image img-fluid rounded-3" alt={item?.description} />
    )
  }

  const TooltipComponent = ({ id, children, title }) => (
    <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>
      {children}
    </OverlayTrigger>
  );
  return (
    <>
      <tr className="cont-admin-purchases-row">
        {props.cols.map((col, index) => {
          switch (col.type) {
            case 'actions':
              return (
                <td key={index}>
                  <div className="d-flex gap-3 align-items-center justify-content-center">
                    {props.showView && <button
                      onClick={() => { setShowView(true); setViewing(props.item); }}
                      className="btn p-0 border-0"
                      type="button"
                      aria-label="Ver pedido">
                      <TooltipComponent title="Ver pedido" id="t-1">
                        <span className="pi pi-eye text-primary"></span>
                      </TooltipComponent>
                    </button>}
                    {props.showDelivered && !props.item.delivered_at && <button
                      onClick={() => { handleShow(); handleSelectedDeliver(props.item); }}
                      className="btn p-0 border-0"
                      type="button"
                      aria-label="Confirmar entrega">
                      <TooltipComponent title="Confirmar entrega" id="t-1">
                        <span className="pi pi-file-check text-success"></span>
                      </TooltipComponent>
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
            case 'relation':
              return (<td key={index} className="text-center">{props.item[col.field] ? props.item[col.field][col.relationField] : null}</td>)
            case 'date':
              return <td key={index} className="text-left"><span className="d-flex justify-content-center">{props.item[col.field] ? DateTime.fromISO(props.item[col.field], { setZone: true }).toFormat('dd-MM-yyyy HH:mm') : <span className='text-danger negritas'>Pendiente</span>}</span></td>
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
      </tr >
      <Modal show={showView} size="lg" variant="white" className="modal-view">
        <Modal.Header className="modal-title" closeButton>
          <Modal.Title className="negritas">Resumen de compra</Modal.Title>
        </Modal.Header>
        <Modal.Body className='d-flex flex-column gap-4'>
          <div>
            <h5>Resumen</h5>
            <p className='mb-0'><span className='negritas'>Usuario:</span> {viewing?.user?.first_name + ' ' + viewing?.user?.last_name} ({viewing?.user?.email})</p>
            <p className='mb-0'><span className='negritas'>Importe Total:</span> ${viewing?.totalCost}</p>
            <p className='mb-0'><span className='negritas'>Cantidad de Items:</span> {viewing?.totalQuantity} artículo{viewing?.totalQuantity > 1 ? 's' : null}</p>
            <p className='mb-0'><span className='negritas'>Demora estimada:</span> {viewing?.totalDelay} día{viewing?.totalDelay > 1 ? 's' : null}</p>
          </div>
          <div className='purchase-items'>
            <h5>Detalle de artículos</h5>
            <ul>
              {viewing?.items?.map((item, index) => (
                <li key={index}>
                  <div className="d-flex justify-content-between align-items-center">

                    <div>
                      <h6 className="mb-0 me-2 d-inline">{item.title}</h6><span className="badge text-bg-primary">{item.material}</span>
                    </div>
                    <div><span>{item.quantity} x </span><span>${item.unit_price}</span></div>
                  </div>
                  <p>{item.description}</p>

                </li>
              ))}
            </ul>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => { setShowView(false); }}
            className="btn btn-link btn-close-link"
            type="button"
            data-toggle="tooltip"
            data-placement="top">
            <span>Cerrar</span>
          </button>
        </Modal.Footer>
      </Modal>
      <Modal show={show} onHide={handleClose} size="lg" variant="white" className="modal-deliver">
        <Modal.Header className="modal-title" closeButton>
          <Modal.Title className="negritas">¿Ya entregaste este pedido?</Modal.Title>
        </Modal.Header>
        <Form onSubmit={(e) => { e.preventDefault(); handleConfirmDelivery({ _id: delivering._id, delivered_at: e.target.delivered_at.value }); }} noValidate>
          <Modal.Body>
            <div className='mb-4'>
              <p className='mb-0'>Seleccioná la fecha en que fue entregado este pedido. El usuario lo verá en su historial.</p>
              <p className='negritas text-danger'> Esta acción es irreversible.</p>
              <small className='negritas'>Fecha de entrega: </small>
              <Form.Control type="date" name="delivered_at" autoFocus placeholder="Fecha de entrega" className="mb-1" />
              <small className="form-text text-danger">
                {errors.delivered_at}
              </small>
            </div>
            <div className='purchase-items'>
              <h5>Detalle de artículos</h5>
              <ul>
                {delivering?.items?.map((item, index) => (
                  <li key={index}>
                    <div className="d-flex justify-content-between align-items-center">

                      <div>
                        <h6 className="mb-0 me-2 d-inline">{item.title}</h6><span className="badge text-bg-primary">{item.material}</span>
                      </div>
                      <div><span>{item.quantity} x </span><span>${item.unit_price}</span></div>
                    </div>
                    <p>{item.description}</p>

                  </li>
                ))}
              </ul>
            </div>
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
              className="btn btn-success"
              type="submit"
              data-toggle="tooltip"
              data-placement="top">
              <span className='pi pi-check'></span><span> Confirmar Entrega</span>
            </button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

// export default Header;
