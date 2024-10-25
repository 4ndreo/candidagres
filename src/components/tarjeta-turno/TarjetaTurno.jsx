import "./TarjetaTurno.css";

import React, { useContext, useEffect, useState } from "react";
import { DateTime, Duration } from "luxon";
import { useNavigate, useParams, Link } from "react-router-dom";
import CustomBadge from "./CustomBadge/CustomBadge";
import { Modal } from "react-bootstrap";
import EnrollModal from "./EnrollModal/EnrollModal";
import { AuthContext } from '../../App';


export default function TarjetaTurno({
  shift,
  classData,
  weekdays,
  handleMouseOver,
  handleMouseLeave,
  hoveredTurno,
  verifyInscripto,
}) {
  const factor = 70;

  const context = useContext(AuthContext);

  const [selectedTurno, setSelectedTurno] = useState({});
  const [selectedInscripcion, setSelectedInscripcion] = useState({});
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);


  function getDistancia(horaInicio, horaFin) {
    let start = DateTime.fromFormat(horaInicio, "HH:mm");
    let end = DateTime.fromFormat(horaFin, "HH:mm");
    let diff = end.diff(start, "hours", "minutes").toFormat("hh:mm");

    let horas = DateTime.fromFormat(diff, "HH:mm").toFormat("HH");
    let minutos = DateTime.fromFormat(diff, "HH:mm").toFormat("mm");

    return parseInt(horas) + parseFloat(minutos) / 60;
  }

  function verifyInscripto() {
    // const test = shift.enrollments.map(inscripcion =>
    //   // context.currentUser._id === inscripcion.id_user && !inscripcion.deleted
    //   Object.entries(inscripcion).some((x) => context.currentUser._id === x.id_user && !x.deleted)
    //   )
    shift.enrollments.some((x) => console.log(x.id_user, x.deleted))
    const test = shift.enrollments.some((x) => context.currentUser._id === x.id_user && x.deleted === false)
      // )
    // console.log(test)
    return test
  }

  return (
    <>

      <div
        className={verifyInscripto() || (shift.enrollmentsCount === shift.max_places) ? "item-turno w-100 inscripto" : "item-turno w-100"}
        style={{
          height: (getDistancia(shift.start_time, shift.end_time) * factor > factor ? getDistancia(shift.start_time, shift.end_time) * factor : factor) + "px",
          top: getDistancia("09:00", shift.start_time) * factor + "px",
          border: "2px solid " + hoveredTurno === shift._id ? "hsl(220 50% 70% / 1)" : "#e6e6e6",
          backgroundColor: hoveredTurno === shift._id ? "hsl(220 50% 70% / 1)" : "#e6e6e6",
        }}
        // onClick={() => {handleSelectedTurno(turno); handleCloseTooltip(true);}}
        onClick={() => setShow(true)}
        onMouseEnter={() => handleMouseOver(shift._id)}
        onMouseLeave={() => handleMouseLeave(shift._id)}
      >
        <div className="d-flex justify-content-between mb-2">
          <h3>{shift.title}</h3>
          {verifyInscripto()
            ?
            <CustomBadge props={{ label: "Inscripto", icon: "check-circle" }} />
            :
            (shift.enrollmentsCount === shift.max_places) ?? <CustomBadge props={{ label: "Completo", icon: "ban" }} />
          }
        </div>
        <div className="d-flex justify-content-between">
          <span>{shift.start_time}-{shift.end_time}hs</span>
          <span className="d-flex align-items-center gap-1"><span className="pi pi-user"></span>{shift.enrollmentsCount}/{shift.max_places}</span>
        </div>

      </div>
      {/* {JSON.stringify(show)} */}
      {show && <EnrollModal props={{ show, setShow, classData, shift, weekdays, verifyInscripto }} />}
    </>
  );
  // }
}
