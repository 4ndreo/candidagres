import "./TarjetaTurno.css";

import React, { useEffect, useState } from "react";
import { DateTime, Duration } from "luxon";
import { useNavigate, useParams, Link } from "react-router-dom";
import TooltipCurso from "../tooltip-curso/TooltipCurso";
export default function TarjetaTurno({
  turno,
  horInicio,
  horFin,
  color,
  selectedTurno,
  handleSelectedTurno,
  handleMouseOver,
  handleMouseLeave,
  hoveredTurno,
  handleShow
}) {
  const factor = 50;
  const [tooltipState, setTooltipState] = useState(false);

  function getDistancia(horaInicio, horaFin) {
    let start = DateTime.fromFormat(horaInicio, "HH:mm");
    let end = DateTime.fromFormat(horaFin, "HH:mm");
    let diff = end.diff(start, "hours", "minutes").toFormat("hh:mm");

    let horas = DateTime.fromFormat(diff, "HH:mm").toFormat("HH");
    let minutos = DateTime.fromFormat(diff, "HH:mm").toFormat("mm");

    return parseInt(horas) + parseFloat(minutos) / 60;
  }

  function handleCloseTooltip(state){
    console.log('estado:', state)
    setTooltipState(state);
  }

  // if (selectedTurno === turno._id) {
  //   return (
  //     <div
  //       className="item-turno w-100"
  //       style={{
  //         height: getDistancia(horInicio, horFin) * factor + "px",
  //         minHeight: getDistancia(horInicio, horFin) * factor + "px",
  //         top: getDistancia("09:00", horInicio) * factor + "px",
  //         border: "2px solid " + color,
  //         backgroundColor: color,
  //       }}
  //       onClick={() => {handleSelectedTurno(null); handleCloseTooltip(false);}}
        
  //       >
  //       <h3>{turno.nombre}</h3>
  //       <p>
  //         {horInicio}-{horFin}hs
  //       </p>
  
  //       {tooltipState ? <TooltipCurso handleCloseTooltip={handleCloseTooltip} turno={turno} /> : null}

  //     </div>
  //   );
  // } else {
    return (
      <div
        className={hoveredTurno === turno._id ? "item-turno w-100 hoveredTurno" : "item-turno w-100"}
        style={{
          height: getDistancia(horInicio, horFin) * factor + "px",
          top: getDistancia("09:00", horInicio) * factor + "px",
          border: "2px solid " + hoveredTurno === turno._id ? "hsl(220 50% 70% / 1)" : "#e6e6e6",
          backgroundColor: hoveredTurno === turno._id ? "hsl(220 50% 70% / 1)" : "#e6e6e6",
        }}
        // onClick={() => {handleSelectedTurno(turno); handleCloseTooltip(true);}}
        onClick={() => {handleShow(); handleSelectedTurno(turno)}}
        onMouseEnter={() => handleMouseOver(turno._id)}
        onMouseLeave={() => handleMouseLeave(turno._id)}
      >
        <h3>{turno.nombre}</h3>
        <p>
          {horInicio}-{horFin}hs
        </p>
      </div>
    );
  // }
}
