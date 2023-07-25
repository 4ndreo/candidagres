import "./TarjetaTurno.css";

import React, { useEffect, useState } from "react";
import { DateTime, Duration } from "luxon";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function TarjetaTurno({
  turno,
  horInicio,
  horFin,
  color,
  selectedTurno,
  handleSelectedTurno,
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
  if (selectedTurno === turno._id) {
    return (
      <li
        className="item-turno w-100"
        style={{
          height: "auto",
          minHeight: getDistancia(horInicio, horFin) * factor + "px",
          top: getDistancia("09:00", horInicio) * factor + "px",
          border: "2px solid " + color,
          backgroundColor: color,
          marginBottom: "2rem"
        }}
        onClick={() => handleSelectedTurno(turno._id)}
      >
        <h3>{turno.nombre}</h3>
        <p>
          {horInicio}-{horFin}hs
        </p>
        <Link
          to={"/id-" + turno._id + "/curso/id-" + turno.idCurso}
          className="btn btn-primary"
        >
          Inscribirse en este horario
        </Link>
      </li>
    );
  } else {
    return (
      <li
        className="item-turno w-100"
        style={{
          height: getDistancia(horInicio, horFin) * factor + "px",
          top: getDistancia("09:00", horInicio) * factor + "px",
          border: "2px solid " + color,
        }}
        onClick={() => handleSelectedTurno(turno._id)}
      >
        <h3>{turno.nombre}</h3>
        <p>
          {horInicio}-{horFin}hs
        </p>
      </li>
    );
  }
}
