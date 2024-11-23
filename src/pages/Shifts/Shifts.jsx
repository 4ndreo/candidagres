import "./Shifts.css";

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import * as classesService from "../../services/classes.service";
import Loader from "../../components/basics/Loader";
import ShiftCard from "../../components/ShiftCard/ShiftCard";
import { useQuery } from "react-query";
import { weekdays } from "../../utils/utils";

export function ShiftsPage() {
  const params = useParams();

  const fetchShifts = async () => {
    const result = await classesService.findOneWithShifts(params.id);
    return result;
  }

  const { data: classData, isLoading, isError, error, refetch } = useQuery(
    'classData_' + params.id,
    fetchShifts,
    {
      staleTime: 60000,
      retry: 2,
    }
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

  return (
    <main className="container main d-grid">
      <div className="shift-cont">
        <h1>Horarios disponibles{classData?.title ? " para " + classData?.title : ""}</h1>
        {isError ?
          renderError() :
          <ul className="cont-listado-dias">
            {weekdays.map((weekday) => {
              return (
                <li key={weekday.id} className="item-dia">
                  <h2> {weekday.name}</h2>
                  <div className="cont-shift-card">
                    {classData?.shifts.map((shift) => {
                      if (shift?.days?.some((day) => day === weekday.id)) {
                        return (
                          <ShiftCard
                            key={shift._id}
                            props={{ shift, classData, weekdays, handleMouseOver, handleMouseLeave, hoveredTurno, refetch }}
                          />
                        );
                      } else {
                        return null;
                      }
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        }
      </div>
    </main>
  );
}
