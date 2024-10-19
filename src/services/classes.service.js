const url = process.env.REACT_APP_API_URL

async function find() {
    return fetch(url + "api/classes", {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) => response.json())
        .catch((err) => { return err });
}

async function findQuery(request) {
    // Construct the full URL
    const fullUrl = new URL(url + "classes");

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

async function findById(idCursos) {
    return fetch(url + "api/classes/" + idCursos, {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) =>
        response.json()
    );
}

async function create(curso) {
    return fetch(url + "api/classes/curso", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(curso),
    }).then((response) => response.json());
}

async function remove(idCursos) {
    return fetch(url + "api/classes/" + idCursos, {
        method: "DELETE",
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) => response.json());
}

async function update(idCursos, curso) {
    return fetch(url + "api/classes/" + idCursos, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(curso),
    }).then((response) => response.json());
}

export { find, findQuery, findById, create, remove, update };
