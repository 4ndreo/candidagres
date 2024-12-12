import "./ShiftCard.css";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { DateTime } from "luxon";
import CustomBadge from "./CustomBadge/CustomBadge";
import EnrollModal from "./EnrollModal/EnrollModal";
import { AuthContext } from '../../App';


export default function ShiftCard({ props }) {
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

  const verifyEnrollment = useCallback(() => {
    return props.shift.enrollments.filter((x) => context.currentUser._id === x.id_user && x.deleted === false);
  }, [props.shift.enrollments, context.currentUser._id]);

  useEffect(() => {
    setUserEnrollment(verifyEnrollment()[0]?._id ?? null)
  }, [props.classData, verifyEnrollment])

  // function verifyEnrollment() {
  //   return props.shift.enrollments.filter((x) => context.currentUser._id === x.id_user && x.deleted === false)
  // }


  const renderBadge = () => {
    if (userEnrollment) return <CustomBadge props={{ label: "Inscripto", icon: "check-circle" }} />;
    if (props.shift.enrollmentsCount === props.shift.max_places) return <CustomBadge props={{ label: "Completo", icon: "lock" }} />;
  }

  return (
    <>
      <div className="shift-card-cont border-display">

        <div
          className={userEnrollment || (props.shift.enrollmentsCount === props.shift.max_places) ? "item-shift w-100 inscripto" : "item-shift w-100"}
          style={{
            height: (getDistancia(props.shift.start_time, props.shift.end_time) * factor > factor ? getDistancia(props.shift.start_time, props.shift.end_time) * factor : factor) + "px",
            top: getDistancia("09:00", props.shift.start_time) * factor + "px",
            // border: "2px solid " + props.hoveredShift === props.shift._id ? "hsl(220 50% 70% / 1)" : "#e6e6e6",
            backgroundColor: props.hoveredShift === props.shift._id ? "hsl(220 50% 70% / 1)" : "#e6e6e6",
          }}
          onClick={() => setShow(true)}
          onMouseEnter={() => props.handleMouseOver(props.shift._id)}
          onMouseLeave={() => props.handleMouseLeave(props.shift._id)}
        >
          <div className="d-flex justify-content-between mb-2 flex-wrap">
            <h3>{props.shift.title}</h3>
            {renderBadge()}
          </div>
          <div className="d-flex justify-content-between flex-wrap">
            <span>{props.shift.start_time}-{props.shift.end_time}hs</span>
            <span className="d-flex align-items-center gap-1"><span className="pi pi-user"></span>{props.shift.enrollmentsCount}/{props.shift.max_places}</span>
          </div>

        </div>
      </div>
      {show && <EnrollModal props={{
        show, setShow, classData: props.classData, shift: props.shift, weekdays: props.weekdays, userEnrollment, refetch: props.refetch, setShowToast: props.setShowToast
      }} />}
    </>
  );
  // }
}
