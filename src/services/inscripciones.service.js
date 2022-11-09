const url = "http://localhost:2025/";

async function find() {
  return fetch(url + "api/inscripciones", {
    headers: {
      "auth-token": localStorage.getItem("token"),
    },
  }).then((response) => response.json());
}

async function findById(idInscripciones) {
  return fetch(url + "api/inscripciones/" + idInscripciones, {
    headers: {
      "auth-token": localStorage.getItem("token"),
    },
  }).then((response) => response.json());
}

async function create(inscripcion) {
  return fetch(url + "api/inscripciones/inscripcion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
    body: JSON.stringify(inscripcion),
  }).then((response) => response.json());
}

async function remove(idInscripciones) {
  return fetch(url + "api/inscripciones/" + idInscripciones, {
    method: "DELETE",
    headers: {
      "auth-token": localStorage.getItem("token"),
    },
  }).then((response) => response.json());
}

async function update(idInscripciones, inscripcion) {
  return fetch(url + "api/inscripciones/" + idInscripciones, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
    body: JSON.stringify(inscripcion),
  }).then((response) => response.json());
}

export { find, findById, create, remove, update };
