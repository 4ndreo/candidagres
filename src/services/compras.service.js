import { fetchWithInterceptor } from "../interceptors/auth";

const url = process.env.REACT_APP_API_URL

async function find(signal) {
    return fetchWithInterceptor(url + "compras", {
        signal
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo traer el historial. Inténtelo de nuevo más tarde') });
}

async function findById(idCompra, signal) {
    return fetchWithInterceptor(url + "compras/" + idCompra, {
        signal
    }).then((response) =>
        response.json()
    ).catch(() => { throw new Error('Error: no se pudo traer el historial. Inténtelo de nuevo más tarde') });
}

async function findByIdUser(idUser, signal) {
    return fetchWithInterceptor(url + "compras/user/" + idUser, {
        signal
    }).then((response) =>
        response.json()
    ).catch(() => { throw new Error('Error: no se pudo traer el historial. Inténtelo de nuevo más tarde') });
}

async function create(data) {
    return fetchWithInterceptor(url + "compras/compra", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(data),
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo crear la compra. Inténtelo de nuevo más tarde') });
}

async function remove(idCompra) {
    return fetchWithInterceptor(url + "compras/" + idCompra, {
        method: "DELETE",
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo eliminar la compra. Inténtelo de nuevo más tarde') });
}

async function update(compra) {
    return fetchWithInterceptor(url + "compras/" + compra._id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ productos: compra.productos }),
    }).then((response) => true
    ).catch(() => { throw new Error('Error: no se pudo modificar la compra. Inténtelo de nuevo más tarde') });
}

// async function savePurchase(data) {
//     return fetchWithInterceptor(url + "compras/" + data._id, {
//         method: "PATCH",
//         headers: {
//             "Content-Type": "application/json",
//             'auth-token': localStorage.getItem('token')
//         },
//         body: JSON.stringify({ productos: data.productos }),
//     }).then((response) => true
//     ).catch(() => { throw new Error('Error: no se pudo actualizar la compra. Inténtelo de nuevo más tarde') });
// }

export {
    find,
    findById,
    findByIdUser,
    create,
    remove,
    update,
    // savePurchase,
};
