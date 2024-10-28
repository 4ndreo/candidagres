const url = process.env.REACT_APP_API_URL

async function find() {
    return fetch(url + "shifts", {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) => response.json())
        .catch((err) => { return err });
}

async function findQuery(request) {
    // Construct the full URL
    const fullUrl = new URL(url + "shifts");

    // Add query parameters to the URL
    Object.entries(request).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach(v => fullUrl.searchParams.append(key, v));
        } else {
            fullUrl.searchParams.append(key, value);
        }
    });

    return fetch(fullUrl, {
        headers: {
            'auth-token': localStorage.getItem('token')
        },
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudieron obtener los registros. Inténtelo de nuevo más tarde') });
}

async function findById(id) {
    return fetch(url + "shifts/" + id, {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) =>
        response.json()
    ).catch(() => { throw new Error('Error: no se pudieron obtener los registros. Inténtelo de nuevo más tarde') });
}

async function findByCurso(id) {
    return fetch(url + "shifts/curso/" + id, {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) =>
        response.json()
    );
}

async function create(data) {
    return fetch(url + "shifts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(data),
    }).then((response) => response.json());
}

async function remove(id) {
    return fetch(url + "shifts/" + id, {
        method: "DELETE",
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) => response.json());
}

async function update(id, data) {
    return fetch(url + "shifts/" + id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(data),
    }).then((response) => response.json());
}

export { find, findQuery, findById, findByCurso, create, remove, update };
