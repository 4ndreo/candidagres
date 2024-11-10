// Styles 
import "./Classes.css";

// React
import { useState, useEffect } from "react";
import { useQuery } from "react-query";

// Services
import * as classesService from "../../services/classes.service";

// Components
import Loader from "../../components/basics/Loader";
import ClassPreview from "../../components/ClassPreview/ClassPreview";
import Paginator from "../../components/Paginator/Paginator";
import CustomToast from "../../components/basics/CustomToast/CustomToast";

export default function ClassesPage() {
  const [showToast, setShowToast] = useState(null);

  const [request, setRequest] = useState({
    page: 0,
    limit: 12,
    filter: [{ field: 'undefined', value: 'undefined' }],
    sort: { field: 'undefined', direction: 1 },
  });

  const fetchProducts = async (request, signal) => {
    const result = await classesService.findQuery({ ...request, filter: JSON.stringify(request.filter), sort: JSON.stringify(request.sort) }, signal);
    return result[0];
  }

  const { data: classesData, isLoading, isError, error, refetch } = useQuery(
    'classesData',
    async ({signal}) => fetchProducts(request, signal),
    {
      staleTime: Infinity,
      retry: 2,
    }
  );

  useEffect(() => {
    refetch();
  }, [request, refetch]);

  function handlePaginate(page) {
    setRequest({ ...request, page: request.limit * page });
  }

  function handlePaginatePrevious() {
    setRequest({ ...request, page: request.page - request.limit });
  }

  function handlePaginateNext() {
    setRequest({ ...request, page: request.page + request.limit });
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
    <main className="container main">
      <div className="classes-cont">
        <h1 className="mb-4">Clases disponibles</h1>
        {isError ?
          renderError() :
          <ul className="classes-list">
            {classesData?.data.length > 0 ?
              classesData?.data.map((item, index) => {
                return (
                  <li key={index} className="">
                    <ClassPreview props={{ item }}></ClassPreview>
                  </li>
                );
              }) :
              <p>No hay clases disponibles.</p>
            }
          </ul>}
      </div>
      {classesData?.data.length > 0 &&
        <Paginator props={{ pages: classesData?.pages ?? 0, count: classesData?.count ?? 0, page: request.page, limit: request.limit, handlePaginate: handlePaginate, handlePaginateNext: handlePaginateNext, handlePaginatePrevious: handlePaginatePrevious }} />

      }
      <CustomToast props={{ data: showToast, setShowToast: setShowToast }} />
    </main>
  );
}
