import "./TooltipCurso.css";

import React, { useEffect, useState } from "react";
import { DateTime, Duration } from "luxon";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function TooltipCurso({handleCloseTooltip, turno}) {
  
    return (
      <div className="cont-tooltip p-2">
        <div className="d-flex justify-content-between">
          <span>{turno.nombre}</span>
          <i className="cancel-icon" onClick={() => handleCloseTooltip(true)}></i>

        </div>
        <Link
          to={"/id-" + turno._id + "/curso/id-" + turno.idCurso}
          className="btn btn-primary"
        >
          Inscribirse en este horario
        </Link>
      </div>
    );
}
