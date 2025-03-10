import "./EnrollmentsProfileCard.css";

import { Link } from "react-router-dom";
import EnrollmentsProfileItem from "./EnrollmentsProfileItem/EnrollmentsProfileItem";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Loader from "../../../components/basics/Loader";
import * as enrollmentsService from "../../../services/enrollments.service";
import Paginator from "../../Paginator/Paginator";

export default function EnrollmentsProfileCard({ props }) {
    const [request, setRequest] = useState({
        page: 0,
        limit: 5,
        filter: [{ field: 'undefined', value: 'undefined' }],
        sort: { field: 'undefined', direction: 1 },
    });

    const fetchEnrollments = async (request, signal) => {
        const result = await enrollmentsService.findOwn(request, signal);
        return result[0];
    }

    const { data: enrollments, isLoading, isError, error, refetch, isRefetching } = useQuery(
        'enrollmentsProfile',
        async ({ signal }) => fetchEnrollments({ ...request, filter: JSON.stringify(request.filter), sort: JSON.stringify(request.sort) }, signal),
        {
            staleTime: 60000,
            retry: 2,
        }
    );


    function handlePaginate(page) {
        setRequest({ ...request, page: request.limit * page });
    }

    function handlePaginatePrevious() {
        setRequest({ ...request, page: request.page - request.limit });
    }

    function handlePaginateNext() {
        setRequest({ ...request, page: request.page + request.limit });
    }

    function resetPagination() {
        setRequest({ ...request, page: 0 });
    }

    useEffect(() => {
        refetch();
    }, [request, refetch]);

    const renderError = () => {
        return (
            <div className="alert alert-danger" role="alert">
                {error.message}
            </div>
        )
    }


    const renderTotalCost = () => {
        return <p className="mb-0 text-start"><span className="negritas">Total de cuotas mensuales:</span> ${enrollments?.totalAmount}</p>
    }

    if (isRefetching || isLoading) {
        return <Loader></Loader>
    }

    return (
        (
            isError ?
                renderError() :
                <div className="card border-0 card-view-profile-enrollments-container">
                    <div className="enrollment-card" id="myEnrollmentsList">
                        <h2> Mis inscripciones</h2>
                        {enrollments?.data?.length > 0 ?
                            <div className="w-100">
                                {renderTotalCost()}
                                {enrollments?.data?.map((enrollment, index) => (
                                    <EnrollmentsProfileItem key={index} props={{ enrollment, refetch, setShowToast: props.setShowToast, resetPagination }} />
                                ))}
                                <Paginator props={{ pages: enrollments?.pages ?? 0, count: enrollments?.count ?? 0, page: request.page, limit: request.limit, handlePaginate: handlePaginate, handlePaginateNext: handlePaginateNext, handlePaginatePrevious: handlePaginatePrevious }} />
                            </div>

                            : <p>No estás inscripto a ninguna clase. Podés ver las clases disponibles <Link to={`/classes`} className="class-title" >acá</Link> </p>}

                    </div >
                </div >
        )
    );
}