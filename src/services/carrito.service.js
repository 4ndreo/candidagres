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

async function update(idCarrito, total, [producto]) {
    return fetch(url + "api/carrito/" + idCarrito, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ total, productosComprar: producto }), // Agrega JSON.stringify para total
    }).then((response) => true);
}


export { find, findById, create, remove, update };
