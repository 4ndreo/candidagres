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

async function findById(idCompra, signal) {
    return fetchWithInterceptor(url + "purchases/" + idCompra, {
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

async function create(data) {
    return fetchWithInterceptor(url + "purchases", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(data),
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo crear la compra. Inténtelo de nuevo más tarde') });
}

async function remove(id) {
    return fetchWithInterceptor(url + "purchases/" + id, {
        method: "DELETE",
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo eliminar la compra. Inténtelo de nuevo más tarde') });
}

async function update(data) {
    return fetchWithInterceptor(url + "purchases/" + data._id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ productos: data.productos }),
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo modificar la data. Inténtelo de nuevo más tarde') });
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
    findById,
    findByIdUser,
    create,
    remove,
    update,
    setDelivered,
};
