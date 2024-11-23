import { fetchWithInterceptor } from "../interceptors/auth";

const url = process.env.REACT_APP_API_URL

async function find(signal) {
    return fetchWithInterceptor(url + "classesAll", {
        signal
    }).then((response) => response.json())
        .catch((err) => { return err });
}

async function findQuery(request, signal) {
    // Construct the full URL
    const fullUrl = new URL(url + "classes");

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
    const fullUrl = new URL(url + "adminClasses");

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

async function findById(id) {
    return fetchWithInterceptor(url + "classes/" + id).then((response) =>
        response.json()
    ).catch(() => { throw new Error('Error: no se pudieron obtener los registros. Inténtelo de nuevo más tarde') });
}

async function findOneWithShifts(id) {
    return fetchWithInterceptor(url + "classes/" + id + "/shifts").then((response) =>
        response.json()
    ).catch(() => { throw new Error('Error: no se pudieron obtener los registros. Inténtelo de nuevo más tarde') });
}

async function create(curso) {
    return fetchWithInterceptor(url + "classes", {
        method: "POST",
        body: JSON.stringify(curso),
    }).then((response) => response.json());
}

async function remove(id) {
    return fetchWithInterceptor(url + "classes/" + id, {
        method: "DELETE"
    }).then((response) => response.json());
}

async function update(id, data) {
    return fetchWithInterceptor(url + "classes/" + id, {
        method: "PATCH",
        body: JSON.stringify(data),
    }).then((response) => response.json());
}

export { find, findQuery, findOwn, findById, findOneWithShifts, create, remove, update };
