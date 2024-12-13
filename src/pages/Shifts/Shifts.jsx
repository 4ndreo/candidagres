import "./Shifts.css";

import React, { useState } from "react";
import {Link, useParams} from "react-router-dom";
import * as classesService from "../../services/classes.service";
import Loader from "../../components/basics/Loader";
import ShiftCard from "../../components/ShiftCard/ShiftCard";
import { useQuery } from "react-query";
import { weekdays } from '../../data/shifts';

export default function ShiftsPage({ props }) {
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

  const [hoveredShift, setHoveredShift] = useState("");

  function handleMouseOver(id) {
    setHoveredShift(id);
  }

  function handleMouseLeave() {
    setHoveredShift('');
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

        <Link to="/classes"
              className="btn btn-link back-btn btn-icon px-0"
              style={{ textDecoration: "none" }}
        >
          <span className="pi pi-angle-left"></span>Volver
        </Link>

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
                            props={{ shift, classData, weekdays, handleMouseOver, handleMouseLeave, hoveredShift, refetch, setShowToast: props.setShowToast }}
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
