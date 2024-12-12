import './EnrollModal.css'

import { useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import * as enrollmentsService from '../../../services/enrollments.service'
import LoaderMini from "../../basics/LoaderMini";



export default function EnrollModal({ props }) {
  const [savingEnrollment, setSavingEnrollment] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setError(null)
    }, 5000)
  }, [error])

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  async function createEnrollment() {
    setSavingEnrollment(true)
    await enrollmentsService.create({ id_shift: props.shift._id })
      .then((resp) => {
        if (resp.err) {
          setError(Object.values(resp.err)[0] ?? 'Error al eliminar la inscripción')
        } else {
          props.refetch()
        }
      })
      .finally(() => { setSavingEnrollment(false); setHovered(false) });
  }

  function removeEnrollment() {
    setSavingEnrollment(true)
    enrollmentsService.remove(props.userEnrollment)
      .then(() => props.refetch())
      .finally(() => { setSavingEnrollment(false); setHovered(false) });
  }

  const renderEnrollmentButton = () => {
    if (savingEnrollment) {
      return (
        <span className='mini-loader-cont'>
          <LoaderMini></LoaderMini>
        </span>
      )
    }
    if (props.userEnrollment) {
      return (
        <button
          type="button"
          className="btn btn-remove-enrollment text-muted"
          onClick={removeEnrollment}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className="d-flex align-items-center gap-1">
            <span className={`pi ${hovered ? 'pi-times-circle text-danger' : 'pi-check-circle'}`}></span>
            <span className={hovered ? 'text-danger' : ''}>{hovered ? 'Darse de baja' : 'Inscripto'}</span>
          </span>
        </button>
      )
    }
    if (props.shift.enrollmentsCount === props.shift.max_places) {
      return (
        <button
          type="button"
          className="btn text-muted d-flex align-items-center gap-1"
        >
          <span className="pi pi-lock"></span>
          <span>Completo</span>
        </button>
      )
    }
    return (
      <button
        type="button"
        disabled={savingEnrollment}
        className={savingEnrollment ? "btn-loading" : "btn btn-primary btn-icon"}
        onClick={createEnrollment}>
        <span className="pi pi-plus"></span>
        {savingEnrollment ? <LoaderMini></LoaderMini> : "Inscribirse en este horario"}
      </button>
    )
  }

  return (
    <Modal className="enroll-modal-cont" show={props.show} size="lg" variant="white">
      <Modal.Header className="modal-title" closeButton>
        <Modal.Title className="negritas">Inscribirse a {props.classData.title}</Modal.Title>
        <button type="button" className="btn btn-link btn-close-link" variant="link" onClick={() => props.setShow(prev => !prev)}></button>
      </Modal.Header>
      <Modal.Body>
        <p><span className="negritas">Detalle de la clase:</span> {props.classData.description}</p>
        <p>
          <span className="negritas">Dias y horario:</span>
          <span> {props.weekdays.filter(day => props.shift.days.includes(day.id)).map(day => day.name).join(', ')}</span>
          <span> de {props.shift.start_time}hs a {props.shift.end_time}hs</span>
        </p>
        <p><span className="negritas">Docente:</span> {props.classData.teacher.charAt(0).toUpperCase() + props.classData.teacher.slice(1)}</p>
        <p><span className="negritas">Cuota mensual:</span> ${props.classData.price}</p>
      </Modal.Body>
      <Modal.Footer>
        {error && <p className="text-danger">{error}</p>}
        {renderEnrollmentButton()}
      </Modal.Footer>
    </Modal>
  )
}
