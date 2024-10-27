import "./Shifts.css";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import * as turnosService from "../../services/shifts.service";
import * as classesService from "../../services/classes.service";
// import * as shiftsService from "../../services/shifts.service";
import * as inscripcionesService from "../../services/enrollments.service";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useContext } from "react";
import { AuthContext } from "../../App";
import LoaderMini from "../../components/basics/LoaderMini";
import Loader from "../../components/basics/Loader";
import TarjetaTurno from "../../components/tarjeta-turno/TarjetaTurno";
import { useQuery } from "react-query";
import { weekdays } from "../../utils/utils";

export function ShiftsPage() {
  let navigate = useNavigate();
  // const value = useContext(AuthContext);
  const params = useParams();

  const fetchShifts = async () => {
    const result = await classesService.findOneWithShifts(params.id);
    return result;
  }

  const { data: classData, isLoading, isError, error, refetch } = useQuery(
    'classData',
    fetchShifts,
    { staleTime: 60000, retry: 2, }
  );

  const [hoveredTurno, setHoveredTurno] = useState("");

  function handleMouseOver(id) {
    setHoveredTurno(id);
  }

  function handleMouseLeave() {
    setHoveredTurno('');
  }

  if (isLoading) {
    return <Loader></Loader>
  }

  const renderError = () => {
    return (
      <div className="alert alert-danger" role="alert">
        {error.message}
      </div>
    )
  }
  // TODO: cambiar por Swiper para mostrar dias de la semana. Esto va a hacer que la funcionalidad sea responsive


  return (

    <main className="container main">
      <div className="cont-turno">
        <h1>Horarios disponibles{classData?.title ? " para " + classData?.title : ""}</h1>
        {isError ?
          renderError() :
          <ul className="cont-listado-dias">
            {weekdays.map((weekday) => {
              return (
                <li key={weekday.id} className="item-dia">
                  <h2> {weekday.name}</h2>
                  <ul className="cont-TarjetaTurnos">
                    {classData?.shifts.map((shift) => {
                      if (shift.days.some((day) => day === weekday.id)) {
                        return (
                          <TarjetaTurno
                            key={shift._id}
                            props={{ shift, classData, weekdays, handleMouseOver, handleMouseLeave, hoveredTurno, refetch }}
                          />
                        );
                      }
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        }
      </div>
    </main>
  );
}
