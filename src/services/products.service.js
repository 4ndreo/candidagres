import { fetchWithInterceptor } from "../interceptors/auth";

const url = process.env.REACT_APP_API_URL

async function find(signal) {
    return fetchWithInterceptor(url + "productsAll", {
        signal
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudieron obtener los registros. Inténtelo de nuevo más tarde') });
}

async function findQuery(request, signal) {
    // Construct the full URL
    const fullUrl = new URL(url + "products");

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
    const fullUrl = new URL(url + "adminProducts");

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
    return fetchWithInterceptor(url + "products/" + id, {
        signal
    }).then((response) =>
        response.json()
    ).catch(() => { throw new Error('Error: no se pudo obtener el producto. Inténtelo de nuevo más tarde') });
}

async function create(data) {
    return fetchWithInterceptor(url + "products", {
        method: "POST",
        headers: {
            'X-Type': 'form',
        },
        body: data,
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo crear. Inténtelo de nuevo más tarde') });
}

async function remove(id) {
    return fetchWithInterceptor(url + "products/" + id, {
        method: "DELETE",
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo eliminar. Inténtelo de nuevo más tarde') });
}

async function update(id, data) {
    return fetchWithInterceptor(url + "products/" + id, {
        method: "PATCH",
        headers: {
            'X-Type': 'form',
        },
        body: data,
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudo modificar. Inténtelo de nuevo más tarde') });
}

async function uploadImagen(imagen) {
    const formData = new FormData();
    formData.append('productImg', imagen);

    return fetchWithInterceptor(url + "products/imagenes", {
        method: "POST",
        body: formData,
    }).then((response) => response.json());
}

export { find, findQuery, findOwn, findById, create, remove, update, uploadImagen };
