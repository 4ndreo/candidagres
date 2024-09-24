const url = process.env.REACT_APP_API_URL

async function find() {
    return fetch(url + "productos", {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudieron obtener los registros. Inténtelo de nuevo más tarde') });
}

async function findById(idProductos) {
    return fetch(url + "productos/" + idProductos, {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) =>
        response.json()
    ).catch(() => { throw new Error('Error: no se pudo obtener el producto. Inténtelo de nuevo más tarde') });
}

async function create(producto) {
    return fetch(url + "productos/producto", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(producto),
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo crear. Inténtelo de nuevo más tarde') });
}

async function remove(idProductos) {
    return fetch(url + "productos/" + idProductos, {
        method: "DELETE",
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo eliminar. Inténtelo de nuevo más tarde') });
}

async function update(idProductos, producto) {
    return fetch(url + "productos/" + idProductos, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(producto),
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo modificar. Inténtelo de nuevo más tarde') });
}

async function uploadImagen(imagen) {
    const formData = new FormData();
    formData.append('imagenProducto', imagen);

    return fetch(url + "productos/imagenes", {
        method: "POST",
        headers: {
            'auth-token': localStorage.getItem('token')
        },
        body: formData,
    }).then((response) => response.json());
}

export { find, findById, create, remove, update, uploadImagen };
