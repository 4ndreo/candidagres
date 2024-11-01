const url = process.env.REACT_APP_API_URL

async function find() {
  return fetch(url + "inscripciones", {
    headers: {
      "auth-token": localStorage.getItem("token"),
    },
  }).then((response) => response.json())
    .catch((err) => { return err });
}

async function findQuery(request, signal) {
  // Construct the full URL
  const fullUrl = new URL(url + "enrollments");

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
    signal
  }).then((response) => response.json()
  ).catch(() => { throw new Error('Error: no se pudieron obtener los registros. Inténtelo de nuevo más tarde') });
}

async function findById(idInscripciones) {
  return fetch(url + "inscripciones/" + idInscripciones, {
    headers: {
      "auth-token": localStorage.getItem("token"),
    },
  }).then((response) => response.json());
}

async function countInscripcionesByCurso(idCurso) {
  return fetch(url + "inscripcionesByCurso/" + idCurso, {
    headers: {
      "auth-token": localStorage.getItem("token"),
    },
  }).then((response) => response.json());
}

async function findByUser(idUser) {
  return fetch(url + "inscripciones/user/" + idUser, {
    headers: {
      "auth-token": localStorage.getItem("token"),
    },
  }).then((response) => response.json());
}

async function findAllByUser(idUser) {
  return fetch(url + "inscripcionesAll/user/" + idUser, {
    headers: {
      "auth-token": localStorage.getItem("token"),
    },
  }).then((response) => response.json());
}

async function findAllByUserAndTurno(idUser, idTurno) {
  return fetch(url + "inscripcionesAll/user/" + idUser + "/turno/" + idTurno, {
    headers: {
      "auth-token": localStorage.getItem("token"),
    },
  }).then((response) => response.json());
}

async function create(inscripcion) {
  return fetch(url + "enrollments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
    body: JSON.stringify(inscripcion),
  }).then((response) => response.json());
}

async function remove(id) {
  return fetch(url + "enrollments/" + id, {
    method: "DELETE",
    headers: {
      "auth-token": localStorage.getItem("token"),
    },
  }).then((response) => response.json());
}

async function update(idInscripciones, inscripcion) {
  return fetch(url + "inscripciones/" + idInscripciones, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
    body: JSON.stringify(inscripcion),
  }).then((response) => response.json());
}

export { find, findQuery, findById, countInscripcionesByCurso, findByUser, findAllByUserAndTurno, findAllByUser, create, remove, update };
