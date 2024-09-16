const url = "http://localhost:2025/";

async function find() {
    return fetch(url + "api/carrito", {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudieron obtener los carritos. Inténtelo de nuevo más tarde') });
    
}

async function findById(idCarrito) {
    return fetch(url + "api/carrito/" + idCarrito, {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) =>
        response.json()
    ).catch(() => { throw new Error('Error: no se pudo obtener el carrito. Inténtelo de nuevo más tarde') });
}

async function findByIdUser(idUser) {
    return fetch(url + "api/carrito/user/" + idUser, {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) =>
        response.json()
    ).catch(() => { throw new Error('Error: no se pudo obtener el carrito. Inténtelo de nuevo más tarde') });
}

async function findByIdUserFinalizado(idUser) {
    return fetch(url + "api/carrito/user/finalizado/" + idUser, {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) =>
        response.json()
    ).catch(() => { throw new Error('Error: no se pudo obtener el carrito. Inténtelo de nuevo más tarde') });
}

async function create(usuarioId) {
    return fetch(url + "api/carrito/carrito", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ usuarioId: usuarioId }),
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo crear el carrito. Inténtelo de nuevo más tarde') });
}

async function remove(idCarrito) {
    return fetch(url + "api/carrito/" + idCarrito, {
        method: "DELETE",
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo eliminar el carrito. Inténtelo de nuevo más tarde') });
}

async function update(carrito) {
    console.log("service.carrito", carrito)
    return fetch(url + "api/carrito/" + carrito._id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ productos: carrito.productos }),
    }).then((response) => true
    ).catch(() => { throw new Error('Error: no se pudo modificar el carrito. Inténtelo de nuevo más tarde') });
}
async function updateElimiarProducto(idCarrito, total, productoEnCarrito) {

    return fetch(url + "api/carrito/user/" + idCarrito, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ total, productosComprar: productoEnCarrito }),
    }).then((response) => response.json());
}

async function createPreference(preference) {
    return fetch(url + "api/create_preference", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(preference),
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo crear la preferencia. Inténtelo de nuevo más tarde') });
}

async function addToCart(idUser, data) {
    return fetch(url + "api/carrito/" + idUser + "/addToCart", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ item: data }),
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo agregar el producto al carrito. Inténtelo de nuevo más tarde') });
}

async function substractToCart(idUser, data) {
    return fetch(url + "api/carrito/" + idUser + "/substractToCart", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ item: data }),
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo eliminar el producto del carrito. Inténtelo de nuevo más tarde') });
}


export {
    find,
    findById,
    findByIdUser,
    findByIdUserFinalizado,
    create,
    remove,
    update,
    updateElimiarProducto,
    createPreference,
    addToCart,
    substractToCart,
};
