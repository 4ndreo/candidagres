// Styles
import "./AdminOpenClassEnrollments.css";
import "../css/AdminTable.css";

// React
import { useQuery } from "react-query";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../App";

// Services
import * as openClassEnrollmentsService from "../../../services/openClassEnrollments.service";

// Components
import Loader from "../../../components/basics/Loader";
import Paginator from "../../../components/Paginator/Paginator";

// External Libraries
import { Button, ButtonGroup, Dropdown, Form } from "react-bootstrap";
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import { DateTime } from "luxon";
import AdminOpenClassEnrollmentRow from "../../../components/AdminOpenClassEnrollmentRow/AdminOpenClassEnrollmentRow";

export default function AdminOpenClassEnrollments({ props }) {
  const value = useContext(AuthContext);

  const cols = [
    { field: 'email', header: 'Email', type: 'string' },
    { field: 'day', header: 'Día', type: 'string' },
    { field: 'shift_start_time', header: 'Horario', type: 'string' },
  ]

  const [exporting, setExporting] = useState(false)
  const [request, setRequest] = useState({
    page: 0,
    limit: 10,
    filter: [{ field: 'undefined', value: 'undefined' }],
    sort: { field: 'undefined', direction: 1 },
  });

  const fetchEnrollments = async (request, signal) => {
    const result = await openClassEnrollmentsService.findQuery(request, signal);
    return result[0];
  }

  const { data: enrollments, isLoading, isError, error, refetch } = useQuery(
    'enrollments',
    async ({ signal }) => fetchEnrollments({ ...request, filter: JSON.stringify(request.filter), sort: JSON.stringify(request.sort) }, signal),
    {
      staleTime: Infinity,
      retry: 2,
    }
  );


  useEffect(() => {
    refetch();
  }, [request, refetch]);

  async function fetchEnrollmentsExcel() {
    const result = await openClassEnrollmentsService.findQuery(
      {
        page: 0,
        limit: 999999,
        filter: JSON.stringify(request.filter),
        sort: JSON.stringify(request.sort)
      }
    )
    return result[0];

  }

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

  async function exportToExcel() {
    setExporting(true);
    const tabs = [
      { label: 'Inscriptos', column: 'Email' },
    ]

    const workbook = new ExcelJS.Workbook();

    const promises = tabs.map(async tab => {
      const enrollmentsExcel = await fetchEnrollmentsExcel();
      const subtotalData = [];

      // Orders array by user
      const items = enrollmentsExcel.data.sort(function (a, b) {
        if (a.email < b.email) {
          return -1;
        }
        return 1
      });

      items.forEach(row => {

        // // Pushes the non subtotal rows into the array.
        subtotalData.push(
          {
            [tab.column]: row.email,
            Día: row.day,
            Horario: row.shift_start_time,
            Presente: ''
          }
        );
      });

      if (items && items?.length > 0) {
        const worksheet = workbook.addWorksheet(tab.label);
        worksheet.addTable({
          name: `${tab.label}Table`,
          ref: 'A1',
          headerRow: true,
          totalsRow: false,
          style: {
            theme: 'TableStyleMedium2',
            showRowStripes: true,
          },
          columns: Object.keys(subtotalData[0]).map(key => ({ name: key, filterButton: true })),
          rows: subtotalData.map(row => Object.values(row)),
        });
      }
    });

    await Promise.all(promises);
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, `Inscripciones_Clase_Abierta.xlsx`);
    setExporting(false);

  }

  return (
    <div className="cont-admin-shifts admin-table">
      <div className="d-md-flex justify-content-between align-items-center mb-3">
        <h1>Administrar Inscripciones de la Clase Abierta</h1>
        <Button variant="success" className="btn-icon" onClick={exportToExcel}>
          <span className={exporting ? 'pi pi-spin pi-spinner' : 'pi pi-file-excel'}></span>{exporting ? 'Exportando...' : 'Exportar'}
        </Button>
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
                {enrollments?.data.length > 0 ?
                  enrollments?.data?.map((item) => {
                    return <AdminOpenClassEnrollmentRow props={{ item: item, refetch: refetch, cols: cols, showEdit: false, showDelete: true, setShowToast: props.setShowToast }} key={item._id} />
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
      {enrollments?.data.length > 0 &&
        <Paginator props={{ pages: enrollments?.pages ?? 0, count: enrollments?.count ?? 0, page: request.page, limit: request.limit, handlePaginate: handlePaginate, handlePaginateNext: handlePaginateNext, handlePaginatePrevious: handlePaginatePrevious }} />

      }
    </div>
  );
}
