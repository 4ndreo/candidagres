const url = "http://localhost:2025/";

async function find() {
    return fetch(url + "api/turnos", {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) => response.json());
}

async function findById(idTurnos) {
    return fetch(url + "api/turnos/" + idTurnos, {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) =>
        response.json()
    );
}

async function findByCurso(idCurso) {
    return fetch(url + "api/turnos/curso/" + idCurso, {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) =>
        response.json()
    );
}

async function create(turno) {
    return fetch(url + "api/turnos/turno", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(turno),
    }).then((response) => response.json());
}

async function remove(idTurnos) {
    return fetch(url + "api/turnos/" + idTurnos, {
        method: "DELETE",
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    }).then((response) => response.json());
}

async function update(idTurnos, turno) {
    return fetch(url + "api/turnos/" + idTurnos, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(turno),
    }).then((response) => response.json());
}

export { find, findById, findByCurso, create, remove, update };
