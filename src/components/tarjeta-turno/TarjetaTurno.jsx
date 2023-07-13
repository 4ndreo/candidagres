import "./TarjetaTurno.css";

import React, { useEffect, useState } from "react";
import { DateTime, Duration } from "luxon";

export default function TarjetaTurno({ turno, horInicio, horFin, color }) {
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
    <li
      className="item-turno w-100"
      style={{ height: getDistancia(horInicio, horFin) * factor + "px",
      top: getDistancia("09:00", horInicio) * factor + "px",
      border: "2px solid "+color,
      
    }}
    >
      <h3>{turno.nombre}</h3>
      {/* {"Altura:" + getDistancia(horInicio, horFin) * factor} | {"Distancia:" + getDistancia("09:00", horInicio)} | 
      {"Factor:" + factor} | */}
      <p>{horInicio}-{horFin}hs</p>
    </li>
  );
}
