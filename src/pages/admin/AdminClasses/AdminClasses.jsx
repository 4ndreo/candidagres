// Styles
import "./AdminClasses.css";
import "../css/AdminTable.css";

// React
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../App";

// Services
import * as classesService from "../../../services/classes.service";

// Components
import Loader from "../../../components/basics/Loader";
import AdminClassRow from "../../../components/AdminClassRow/AdminClassRow";
import Paginator from "../../../components/Paginator/Paginator";

// External Libraries
import { Button, ButtonGroup, Dropdown, Form } from "react-bootstrap";

export default function AdminClasses({ props }) {
  const value = useContext(AuthContext);

  const cols = [
    { field: 'actions', header: 'Acciones', type: 'actions' },
    { field: 'title', header: 'Título', type: 'string' },
    { field: 'description', header: 'Descripción', type: 'string' },
    { field: 'teacher', header: 'Docente', type: 'string' },
    { field: 'price', header: 'Precio', type: 'currency' },
    { field: 'min_age', header: 'Edad mínima', type: 'number' },
  ]

  const [request, setRequest] = useState({
    page: 0,
    limit: 10,
    filter: [{ field: 'undefined', value: 'undefined' }],
    sort: { field: 'undefined', direction: 1 },
  });

  const fetchClasses = async (request, signal) => {
    const result = await classesService.findOwn({ ...request, filter: JSON.stringify(request.filter), sort: JSON.stringify(request.sort) }, signal);
    return result[0];
  }

  const { data: classes, isLoading, isError, error, refetch, isRefetching } = useQuery(
    'classes',
    async ({ signal }) => fetchClasses(request, signal),
    {
      staleTime: 300000,
      retry: 2,
    }
  );

  // useEffect(() => {
  //   setShowToast(location?.state || { show: false, title: 'Vacío', message: 'No hay mensajes que mostrar.', variant: 'success', position: 'top-end' });
  //   navigate(location.pathname, { replace: true });
  // }, [ location.pathname, navigate]);

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
      // case 'date':
      case 'created_by':
        return (
          value.currentUser?.role === 1 &&
          <th scope="col" className="col-header align-middle" key={col.field}>{col.header}</th>
        )
      default:
        return (
          <th className="col-header align-middle" scope="col" key={col.field}>{col.header}</th>
        )

    }
  }

  if (isRefetching || isLoading) {
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
    <div className="cont-admin-classes admin-table">
      <div className="d-md-flex justify-content-between align-items-center mb-3">

        <h1>Administrar Clases</h1>
        <Link to="new" className="btn btn-primary btn-icon">
          <span className="pi pi-plus"></span>Crear una Clase
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
                {classes?.data.length > 0 ?
                  classes?.data?.map((item) => {
                    return <AdminClassRow props={{ item: item, refetch: refetch, cols: cols, showEdit: true, showDelete: true, setShowToast: props.setShowToast }} key={item._id} />
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
      {classes?.data.length > 0 &&
        <Paginator props={{ pages: classes?.pages ?? 0, count: classes?.count ?? 0, page: request.page, limit: request.limit, handlePaginate: handlePaginate, handlePaginateNext: handlePaginateNext, handlePaginatePrevious: handlePaginatePrevious }} />

      }

    </div>
  );
}
