const url = "http://localhost:2025/";

async function find() {
    return fetch(url + "api/carrito", {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) => response.json());
}

async function findById(idCarrito) {
    return fetch(url + "api/carrito/" + idCarrito, {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) =>
        response.json()
    );
}

async function findByIdUser(idUser) {
    return fetch(url + "api/carrito/user/" + idUser, {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) =>
        response.json()
    );
}

async function findByIdUserFinalizado(idUser) {
    return fetch(url + "api/carrito/user/finalizado/" + idUser, {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) =>
        response.json()
    );
}

async function create(carrito) {
    return fetch(url + "api/carrito/carrito", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(carrito),
    }).then((response) => response.json());
}

async function remove(idCarrito) {
    return fetch(url + "api/carrito/" + idCarrito, {
        method: "DELETE",
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) => response.json());
}

async function update(idCarrito, total, productoEnCarrito) {
    console.log("service.carrito",productoEnCarrito)
    return fetch(url + "api/carrito/" + idCarrito, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ total, productosComprar: productoEnCarrito }),
    }).then((response) => true);
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



export { find,
    findById,
    findByIdUser,
    findByIdUserFinalizado,
    create,
    remove,
    update,
    updateElimiarProducto };
