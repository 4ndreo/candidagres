import { fetchWithInterceptor } from "../interceptors/auth";

const url = process.env.REACT_APP_API_URL

async function find(signal) {
    return fetchWithInterceptor(url + "purchasesAll", {
        signal
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo traer el historial. Inténtelo de nuevo más tarde') });
}

async function findQuery(request, signal) {
    // Construct the full URL
    const fullUrl = new URL(url + "purchases");

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

async function findOwn(request, signal) {
    // Construct the full URL
    const fullUrl = new URL(url + "purchases/own");

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
    return fetchWithInterceptor(url + "purchases/" + id, {
        signal
    }).then((response) =>
        response.json()
    ).catch(() => { throw new Error('Error: no se pudo traer el historial. Inténtelo de nuevo más tarde') });
}

async function findByIdUser(idUser, signal) {
    return fetchWithInterceptor(url + "purchases/user/" + idUser, {
        signal
    }).then((response) =>
        response.json()
    ).catch(() => { throw new Error('Error: no se pudo traer el historial. Inténtelo de nuevo más tarde') });
}

async function setDelivered(data) {
    return fetchWithInterceptor(url + "purchases/" + data._id + '/deliver', {
        method: "PATCH",
        body: JSON.stringify(data),
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo modificar la compra. Inténtelo de nuevo más tarde') });
}

export {
    find,
    findQuery,
    findOwn,
    findById,
    findByIdUser,
    // create, // Removed because is not in use
    // update, // Removed because is not in use, purchases shouldn't be updated
    // remove, // Removed because is not in use, purchases shouldn't be deleted
    setDelivered,
};
