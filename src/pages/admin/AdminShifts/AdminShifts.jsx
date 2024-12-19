// Styles
import "./AdminShifts.css";
import "../css/AdminTable.css";

// React
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../App";

// Services
import * as shiftsService from "../../../services/shifts.service";
import * as classesService from "../../../services/classes.service";

// Components
import Loader from "../../../components/basics/Loader";
import AdminShiftRow from "../../../components/AdminShiftRow/AdminShiftRow";
import Paginator from "../../../components/Paginator/Paginator";

// External Libraries
import { Button, ButtonGroup, Dropdown, Form } from "react-bootstrap";

export default function AdminShifts({ props }) {
  const value = useContext(AuthContext);

  const cols = [
    { field: 'actions', header: 'Acciones', type: 'actions' },
    { field: 'title', header: 'Título', type: 'string' },
    { field: 'description', header: 'Descripción', type: 'string' },
    { field: 'class', header: 'Clase', type: 'relation', relationField: 'title' },
    { field: 'start_time', header: 'Inicio', type: 'string' },
    { field: 'end_time', header: 'Fin', type: 'string' },
    { field: 'max_places', header: 'Cupos', type: 'number' },
    { field: 'days', header: 'Días', type: 'days' },
  ]

  const [request, setRequest] = useState({
    page: 0,
    limit: 10,
    filter: [{ field: 'undefined', value: 'undefined' }],
    sort: { field: 'undefined', direction: 1 },
  });

  const fetchShifts = async (request, signal) => {
    const result = await shiftsService.findQuery({ ...request, filter: JSON.stringify(request.filter), sort: JSON.stringify(request.sort) }, signal);
    return result[0];
  }

  const fetchClasses = async (signal) => {
    const result = await classesService.find(signal);
    return result;
  }

  const { data: shifts, isLoading, isError, error, refetch } = useQuery(
    'shifts',
    async ({ signal }) => fetchShifts(request, signal),
    {
      staleTime: 300000,
      retry: 2,
    }
  );

  const { data: classes } = useQuery(
    'classesShifts',
    async ({ signal }) => fetchClasses(signal),
    {
      staleTime: 300000,
      retry: 2,
    }
  );

  useEffect(() => {
    refetch();
  }, [request, refetch]);


  function handleFilter(field, value) {
    if (request.filter.some(x => x.field === field)) {
      request.filter[request.filter.findIndex(x => x.field === field)] = { field, value }
    } else {
      request.filter.push({ field, value })
    }

    setRequest({ ...request, page: 0 });
  }

  function handleSort(field) {
    const parsedSort = request.sort
    if (parsedSort.field === field) {
      setRequest({ ...request, page: 0, sort: { field, direction: parsedSort.direction === 1 ? -1 : 1 } });
    } else {
      setRequest({ ...request, page: 0, sort: { field, direction: 1 } });
    }
  }

  function handleClear(field) {
    request.filter[request.filter.findIndex(x => x.field === field)] = {}
    setRequest({ ...request });
  }

  function handlePaginate(page) {
    setRequest({ ...request, page: request.limit * page });
  }

  function handlePaginatePrevious() {
    setRequest({ ...request, page: request.page - request.limit });
  }

  function handlePaginateNext() {
    setRequest({ ...request, page: request.page + request.limit });
  }

  const renderError = () => {
    return (
      <div className="alert alert-danger" role="alert">
        {error.message}
      </div>
    )
  }

  const renderCols = (col) => {
    switch (col.type) {
      case 'string':
        return (
          <th className="col-header align-middle" scope="col" key={col.field}>
            <Dropdown as={ButtonGroup}>
              <Button className="col-label" variant="link" onClick={(e) => { e.preventDefault(); handleSort(col.field) }}>
                <span>{col.header}</span>
                {request.sort.field === col.field && <span className={"pi pi-sort-alpha" + (request.sort.direction === 1 ? "-down" : "-down-alt")}></span>}
              </Button>

              <Dropdown.Toggle split as={request.filter.some(x => x.field === col.field) ? renderSelectedFilterMenu : renderFilterMenu} />


              <Dropdown.Menu className="cont-search">
                <Form onSubmit={(e) => { e.preventDefault(); handleFilter(col.field, e.target.filter.value) }}>
                  <Form.Control type="text" name="filter" autoFocus placeholder={"Buscar por " + col.header} />
                  <div className="d-flex mt-2 justify-content-end gap-2">
                    <Button variant="outline-secondary" onClick={(e) => { e.preventDefault(); handleClear(col.field) }}>Limpiar</Button>
                    <Button variant="primary" type="submit">Aplicar</Button>
                  </div>
                </Form>
              </Dropdown.Menu>
            </Dropdown>
          </th>
        )
      case 'number':
      case 'currency':
        return (
          <th className="col-header align-middle" scope="col" key={col.field}>
            <Dropdown as={ButtonGroup}>
              <Button className="col-label" variant="link" onClick={(e) => { e.preventDefault(); handleSort(col.field) }}>
                <span>{col.header}</span>
                {request.sort.field === col.field && <span className={"pi pi-sort-numeric" + (request.sort.direction === 1 ? "-down" : "-down-alt")}></span>}
              </Button>
            </Dropdown>
          </th>
        )
      case 'relation':
        return (
          <th className="col-header align-middle" scope="col" key={col.field}>
            <Dropdown as={ButtonGroup}>
              <span>{col.header}</span>
              <Dropdown.Toggle split as={request.filter.some(x => x.field === 'id_' + col.field) ? renderSelectedFilterMenu : renderFilterMenu} />
              <Dropdown.Menu className="cont-search">
                <Form onSubmit={(e) => { e.preventDefault(); handleFilter('id_' + col.field, e.target.filter.value) }}>
                  <Form.Select id={col.field} name="filter">
                    {classes?.map((x) => (
                      <option key={x._id} value={x._id}>{x.title}</option>
                    ))}
                  </Form.Select>
                  <div className="d-flex mt-2 justify-content-end gap-2">
                    <Button variant="outline-secondary" onClick={(e) => { e.preventDefault(); handleFilter(undefined, undefined) }}>Limpiar</Button>
                    <Button variant="primary" type="submit">Aplicar</Button>
                  </div>
                </Form>
              </Dropdown.Menu>
            </Dropdown>
          </th>
        )
      // case 'date':
      case 'created_by':
        return (
          value.currentUser?.role === 1 &&
          <th scope="col" className="col-header align-middle" key={col.field}>{col.header}</th>
        )
      default:
        return (
          <th scope="col" className="col-header align-middle" key={col.field}>{col.header}</th>
        )

    }
  }

  if (isLoading) {
    return <Loader></Loader>
  }

  const renderFilterMenu = React.forwardRef(({ onClick }, ref) => (
    <Button
      className="btn-filter"
      variant="secondary-outline"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }
      }
    >
      <span className={"pi pi-filter"}></span>
    </Button>
  ));
  const renderSelectedFilterMenu = React.forwardRef(({ onClick }, ref) => (
    <Button
      className="btn-filter"
      variant="link"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }
      }
    >
      <span className="pi pi-filter-fill"></span>
    </Button>
  ));

  return (
    <div className="cont-admin-shifts admin-table">
      <div className="d-md-flex justify-content-between align-items-center mb-3">

        <h1>Administrar Comisiones</h1>
        <Link to="new" className="btn btn-primary btn-icon">
          <span className="pi pi-plus"></span>Crear una Comisión
        </Link>
      </div>
      {isError ?
        renderError() :
        <div className="d-grid">

          <div className="table-responsive">
            <table className="table table-hover table-striped ">
              <thead>
                <tr>
                  {cols.map((col) => {
                    return renderCols(col);
                  })}
                </tr>
              </thead>
              <tbody>
                {shifts?.data.length > 0 ?
                  shifts?.data?.map((item) => {
                    return <AdminShiftRow props={{ item: item, refetch: refetch, cols: cols, showEdit: true, showDelete: true, setShowToast: props.setShowToast }} key={item._id} />
                  })
                  :
                  <tr>
                    <td colSpan={cols.length}>No hay registros que coincidan con esa búsqueda. Intentá ampliar el criterio.</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
      {shifts?.data.length > 0 &&
        <Paginator props={{ pages: shifts?.pages ?? 0, count: shifts?.count ?? 0, page: request.page, limit: request.limit, handlePaginate: handlePaginate, handlePaginateNext: handlePaginateNext, handlePaginatePrevious: handlePaginatePrevious }} />
      }

    </div>
  );
}
