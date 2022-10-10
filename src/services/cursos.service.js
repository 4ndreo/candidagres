const url = "http://localhost:2025/";

async function find() {
    return fetch(url + "api/cursos", {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) => response.json());
}

async function findById(idCursos) {
    return fetch(url + "api/cursos/" + idCursos, {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) =>
        response.json()
    );
}

async function create(curso) {
    return fetch(url + "api/cursos/curso", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(curso),
    }).then((response) => response.json());
}

async function remove(idCursos) {
    return fetch(url + "api/cursos/" + idCursos, {
        method: "DELETE",
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) => response.json());
}

async function update(idCursos, curso) {
    return fetch(url + "api/cursos/" + idCursos, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(curso),
    }).then((response) => response.json());
}

export { find, findById, create, remove, update };
