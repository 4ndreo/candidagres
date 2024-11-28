import { fetchWithInterceptor } from "../interceptors/auth";

const url = process.env.REACT_APP_API_URL

async function find(signal) {
    return fetchWithInterceptor(url + "carrito", {
        signal
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudieron obtener los carritos. Inténtelo de nuevo más tarde') });

}

async function findById(idCarrito, signal) {
    return fetchWithInterceptor(url + "carrito/" + idCarrito, {
        signal
    }).then((response) =>
        response.json()
    ).catch(() => { throw new Error('Error: no se pudo obtener el carrito. Inténtelo de nuevo más tarde') });
}

async function findByIdUser(idUser, signal) {
    return fetchWithInterceptor(url + "carrito/user/" + idUser, {
        signal
    }).then((response) =>
        response.json()
    ).catch(() => { throw new Error('Error: no se pudo obtener el carrito. Inténtelo de nuevo más tarde') });
}


async function create(id_user) {
    return fetchWithInterceptor(url + "carrito/carrito", {
        method: "POST",
        body: JSON.stringify({ id_user: id_user }),
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo crear el carrito. Inténtelo de nuevo más tarde') });
}

async function remove(idCarrito) {
    return fetchWithInterceptor(url + "carrito/" + idCarrito, {
        method: "DELETE"
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo eliminar el carrito. Inténtelo de nuevo más tarde') });
}

async function update(carrito) {
    return fetchWithInterceptor(url + "carrito/" + carrito._id, {
        method: "PATCH",
        body: JSON.stringify({ productos: carrito.productos }),
    }).then((response) => true
    ).catch(() => { throw new Error('Error: no se pudo modificar el carrito. Inténtelo de nuevo más tarde') });
}

async function createPreference(preference) {
    return fetchWithInterceptor(url + "create_preference", {
        method: "POST",
        body: JSON.stringify(preference),
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo crear la preferencia. Inténtelo de nuevo más tarde') });
}

async function addToCart(idUser, data) {
    return fetchWithInterceptor(url + "carrito/" + idUser + "/addToCart", {
        method: "PATCH",
        body: JSON.stringify({ item: data }),
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo agregar el producto al carrito. Inténtelo de nuevo más tarde') });
}

async function substractToCart(idUser, data) {
    return fetchWithInterceptor(url + "carrito/" + idUser + "/substractToCart", {
        method: "PATCH",
        body: JSON.stringify({ item: data }),
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo eliminar el producto del carrito. Inténtelo de nuevo más tarde') });
}


export {
    find,
    findById,
    findByIdUser,
    create,
    remove,
    update,
    createPreference,
    addToCart,
    substractToCart,
};
