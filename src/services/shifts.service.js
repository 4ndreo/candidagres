import { fetchWithInterceptor } from "../interceptors/auth";

const url = process.env.REACT_APP_API_URL

async function find(signal) {
    return fetchWithInterceptor(url + "shifts", {
        signal
    }).then((response) => response.json())
        .catch((err) => { return err });
}

async function findQuery(request, signal) {
    // Construct the full URL
    const fullUrl = new URL(url + "shifts");

    // Add query parameters to the URL
    Object.entries(request).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach(v => fullUrl.searchParams.append(key, v));
        } else {
            fullUrl.searchParams.append(key, value);
        }
    });

    return fetchWithInterceptor(fullUrl, {
        signal
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudieron obtener los registros. Inténtelo de nuevo más tarde') });
}

async function findById(id, signal) {
    return fetchWithInterceptor(url + "shifts/" + id, {
        signal
    }).then((response) =>
        response.json()
    ).catch(() => { throw new Error('Error: no se pudieron obtener los registros. Inténtelo de nuevo más tarde') });
}

// async function findOneWithEnrollments(id) {
//     return fetchWithInterceptor(url + "shifts/" + id + "/enrollments", {
//         headers: {
//             'auth-token': localStorage.getItem('token')
//         }
//     }).then((response) =>
//         response.json()
//     ).catch(() => { throw new Error('Error: no se pudieron obtener los registros. Inténtelo de nuevo más tarde') });
// }

// async function findByCurso(id) {
//     return fetchWithInterceptor(url + "shifts/curso/" + id, {
//         headers: {
//             'auth-token': localStorage.getItem('token')
//         }
//     }).then((response) =>
//         response.json()
//     );
// }

async function create(data) {
    return fetchWithInterceptor(url + "shifts", {
        method: "POST",
        body: JSON.stringify(data),
    }).then((response) => response.json());
}

async function remove(id) {
    return fetchWithInterceptor(url + "shifts/" + id, {
        method: "DELETE",
    }).then((response) => response.json());
}

async function update(id, data) {
    return fetchWithInterceptor(url + "shifts/" + id, {
        method: "PATCH",
        body: JSON.stringify(data),
    }).then((response) => response.json());
}

export {
    find,
    findQuery,
    findById,
    // findOneWithEnrollments,
    // findByCurso,
    create,
    remove,
    update
};
