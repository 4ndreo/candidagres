import "./TarjetaTurno.css";

import React, { useEffect, useState } from "react";
import { DateTime, Duration } from "luxon";
import { useNavigate, useParams, Link } from "react-router-dom";
export default function TarjetaTurno({
  turno,
  handleSelectedTurno,
  handleSelectedInscripcion,
  handleMouseOver,
  handleMouseLeave,
  hoveredTurno,
  handleShow,
  verifyInscripto,
  inscripcion,
  cupos,
}) {
  const factor = 50;

  function getDistancia(horaInicio, horaFin) {
    let start = DateTime.fromFormat(horaInicio, "HH:mm");
    let end = DateTime.fromFormat(horaFin, "HH:mm");
    let diff = end.diff(start, "hours", "minutes").toFormat("hh:mm");

    let horas = DateTime.fromFormat(diff, "HH:mm").toFormat("HH");
    let minutos = DateTime.fromFormat(diff, "HH:mm").toFormat("mm");

    return parseInt(horas) + parseFloat(minutos) / 60;
  }

    return (
      <div
        className={ verifyInscripto(turno._id).some(val => val) ? "item-turno w-100 inscripto" : "item-turno w-100" }
        style={{
          height: getDistancia(turno.horarioInicio, turno.horarioFin) * factor + "px",
          top: getDistancia("09:00", turno.horarioInicio) * factor + "px",
          border: "2px solid " + hoveredTurno === turno._id ? "hsl(220 50% 70% / 1)" : "#e6e6e6",
          backgroundColor: hoveredTurno === turno._id ? "hsl(220 50% 70% / 1)" : "#e6e6e6",
        }}
        // onClick={() => {handleSelectedTurno(turno); handleCloseTooltip(true);}}
        onClick={() => {handleShow(); handleSelectedTurno(turno); handleSelectedInscripcion(inscripcion)}}
        onMouseEnter={() => handleMouseOver(turno._id)}
        onMouseLeave={() => handleMouseLeave(turno._id)}
      >
        <div className="d-flex justify-content-between mb-2">

        <h3>{turno.nombre}</h3>
        {verifyInscripto(turno._id).some(val => val) ?
        <span className="badge-inscripto badge bg-secondary">
          <svg className="me-1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m10.6 16.6l7.05-7.05l-1.4-1.4l-5.65 5.65l-2.85-2.85l-1.4 1.4l4.25 4.25ZM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"/></svg>
          <span>Inscripto</span>
        </span>: null }
          </div>
        <div className="d-flex justify-content-between">
          <span>{turno.horarioInicio}-{turno.horarioFin}hs</span>
          <span className="cupos">{cupos.map(cupo => cupo._id === turno._id ? cupo.totalQuantity : null)}/{turno.max_cupos}</span>
        </div>
        
      </div>
    );
  // }
}
