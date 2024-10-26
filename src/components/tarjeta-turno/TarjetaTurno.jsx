import "./TarjetaTurno.css";

import React, { useContext, useEffect, useState } from "react";
import { DateTime, Duration } from "luxon";
import { useNavigate, useParams, Link } from "react-router-dom";
import CustomBadge from "./CustomBadge/CustomBadge";
import { Modal } from "react-bootstrap";
import EnrollModal from "./EnrollModal/EnrollModal";
import { AuthContext } from '../../App';


export default function TarjetaTurno({ props }) {
  const factor = 70;

  const context = useContext(AuthContext);

  const [show, setShow] = useState(false);
  const [userEnrollment, setUserEnrollment] = useState();

  function getDistancia(start_time, end_time) {
    let start = DateTime.fromFormat(start_time, "HH:mm");
    let end = DateTime.fromFormat(end_time, "HH:mm");
    let diff = end.diff(start, "hours", "minutes").toFormat("hh:mm");

    let horas = DateTime.fromFormat(diff, "HH:mm").toFormat("HH");
    let minutos = DateTime.fromFormat(diff, "HH:mm").toFormat("mm");

    return parseInt(horas) + parseFloat(minutos) / 60;
  }

  useEffect(() => {
    setUserEnrollment(verifyEnrollment()[0]?._id ?? null)
  }, [props.classData])

  function verifyEnrollment() {
    return props.shift.enrollments.filter((x) => context.currentUser._id === x.id_user && x.deleted === false)
  }

  const renderBadge = () => {
    if (userEnrollment) return <CustomBadge props={{ label: "Inscripto", icon: "check-circle" }} />;
    if (props.shift.enrollmentsCount === props.shift.max_places) return <CustomBadge props={{ label: "Completo", icon: "lock" }} />;
  }

  return (
    <>

      <div
        className={userEnrollment || (props.shift.enrollmentsCount === props.shift.max_places) ? "item-turno w-100 inscripto" : "item-turno w-100"}
        style={{
          height: (getDistancia(props.shift.start_time, props.shift.end_time) * factor > factor ? getDistancia(props.shift.start_time, props.shift.end_time) * factor : factor) + "px",
          top: getDistancia("09:00", props.shift.start_time) * factor + "px",
          border: "2px solid " + props.hoveredTurno === props.shift._id ? "hsl(220 50% 70% / 1)" : "#e6e6e6",
          backgroundColor: props.hoveredTurno === props.shift._id ? "hsl(220 50% 70% / 1)" : "#e6e6e6",
        }}
        // onClick={() => {handleSelectedTurno(turno); handleCloseTooltip(true);}}
        onClick={() => setShow(true)}
        onMouseEnter={() => props.handleMouseOver(props.shift._id)}
        onMouseLeave={() => props.handleMouseLeave(props.shift._id)}
      >
        <div className="d-flex justify-content-between mb-2">
          <h3>{props.shift.title}</h3>
          {renderBadge()}
        </div>
        <div className="d-flex justify-content-between">
          <span>{props.shift.start_time}-{props.shift.end_time}hs</span>
          <span className="d-flex align-items-center gap-1"><span className="pi pi-user"></span>{props.shift.enrollmentsCount}/{props.shift.max_places}</span>
        </div>

      </div>
      {show && <EnrollModal props={{
        show, setShow, classData: props.classData, shift: props.shift, weekdays: props.weekdays, userEnrollment, refetch: props.refetch
      }} />}
    </>
  );
  // }
}
