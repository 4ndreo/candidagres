const url = "http://localhost:2025/";

async function find() {
    return fetch(url + "api/compras", {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) => response.json());
}

async function findById(idCompra) {
    return fetch(url + "api/compras/" + idCompra, {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) =>
        response.json()
    );
}

async function findByIdUser(idUser) {
    return fetch(url + "api/compras/user/" + idUser, {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) =>
        response.json()
    );
}

async function create(data) {
    return fetch(url + "api/compras/compra", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(data),
    }).then((response) => response.json());
}

async function remove(idCompra) {
    return fetch(url + "api/compras/" + idCompra, {
        method: "DELETE",
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) => response.json());
}

async function update(compra) {
    console.log("service.compra", compra)
    return fetch(url + "api/compras/" + compra._id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ productos: compra.productos }),
    }).then((response) => true);
}

async function savePurchase(data) {
    return fetch(url + "api/compras/" + data._id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ productos: data.productos }),
    }).then((response) => true);
}

export {
    find,
    findById,
    findByIdUser,
    create,
    remove,
    update,
    savePurchase,
};
