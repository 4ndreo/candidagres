import { useContext, useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import * as enrollmentsService from '../../../services/enrollments.service'
import { AuthContext } from "../../../App";
import LoaderMini from "../../basics/LoaderMini";



export default function EnrollModal({ props }) {
  // const context = useContext(AuthContext);

  const [savingEnrollment, setSavingEnrollment] = useState(false);

  let daysCount = 0;

  function handleInscripciones() {
    createEnrollment()
  }

  function createEnrollment() {
    enrollmentsService.create({id_shift: props.shift._id})
      .then(() => props.updateEnrollments())
      .finally(() => setSavingEnrollment(false));
  }

  // function createEnrollment() {
  //   enrollmentsService.create(props.shift._id)
  //     .then(() => props.updateEnrollments())
  //     .finally(() => setSavingEnrollment(false));
  // }

  useEffect(() => {
    // console.log(props.show)
  }, [])

  return (
    <Modal show={props.show} size="lg" variant="white">
      <Modal.Header className="modal-title" closeButton>
        <Modal.Title className="negritas">Inscribirse al curso de {props.classData.title}</Modal.Title>
        <button type="button" className="btn btn-link btn-close-link" variant="link" onClick={() => props.setShow(prev => !prev)}></button>
      </Modal.Header>
      <Modal.Body>
        <p><span className="negritas">Detalle de la clase:</span> {props.classData.description}</p>
        <p>
          <span className="negritas">Dias y horario:</span>
          {props.shift.days?.map(dia => {

            daysCount++
            return (
              <span key={dia}>{daysCount > 1 ? ', ' : ''} {props.weekdays.find(o => o.id === dia).nombre}</span>

            )
          })}
          <span> de {props.shift.start_time}hs a {props.shift.end_time}hs</span>
        </p>
        <p><span className="negritas">Docente:</span> {props.classData.teacher.charAt(0).toUpperCase() + props.classData.teacher.slice(1)}</p>
        <p><span className="negritas">Precio:</span> ${props.classData.price}</p>
      </Modal.Body>
      <Modal.Footer>

        {props.verifyInscripto() ?
          <button
            type="button"
            disabled={savingEnrollment}
            className={savingEnrollment ? "btn-close-link btn-loading" : "btn-close-link btn-inscripto"}
            onClick={() => handleInscripciones(props.shift)}>
            {savingEnrollment ? <LoaderMini></LoaderMini> : ""}
          </button>
          :
          (props.shift.enrollmentCount === props.shift.max_places) ?
            <button
              type="button"
              className="btn btn-link btn-close-link btn-full"
              disabled>
            </button>
            :
            <button
              type="button"
              disabled={savingEnrollment}
              className={savingEnrollment ? "btn-loading" : "btn btn-primary btn-icon"}
              onClick={() => createEnrollment()}>
              <span className="pi pi-plus"></span>
              {savingEnrollment ? <LoaderMini></LoaderMini> : "Inscribirse en este horario"}
            </button>
        }
      </Modal.Footer>
    </Modal>
  )
}
