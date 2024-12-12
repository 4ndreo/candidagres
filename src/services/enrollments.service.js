import { fetchWithInterceptor } from "../interceptors/auth";

const url = process.env.REACT_APP_API_URL

async function find(signal) {
  return fetchWithInterceptor(url + "enrollments", {
    signal
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

  return fetchWithInterceptor(fullUrl, {
    signal
  }).then((response) => response.json()
  ).catch(() => { throw new Error('Error: no se pudieron obtener los registros. Inténtelo de nuevo más tarde') });
}

async function findOwn(request, signal) {
  // Construct the full URL
  const fullUrl = new URL(url + "enrollments/own");

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

async function findById(idInscripciones, signal) {
  return fetchWithInterceptor(url + "enrollments/" + idInscripciones, {
    signal
  }).then((response) => response.json());
}

async function findByUser(idUser, signal) {
  return fetchWithInterceptor(url + "enrollments/user/" + idUser, {
    signal
  }).then((response) => response.json());
}

async function create(enrollment) {
  return fetchWithInterceptor(url + "enrollments", {
    method: "POST",
    body: JSON.stringify(enrollment),
  }).then((response) => response.json())

}

async function remove(id) {
  return fetchWithInterceptor(url + "enrollments/" + id, {
    method: "DELETE",
  }).then((response) => response.json());
}

// async function update(idInscripciones, enrollment) {
//   return fetchWithInterceptor(url + "enrollments/" + idInscripciones, {
//     method: "PATCH",
//     body: JSON.stringify(enrollment),
//   }).then((response) => response.json());
// }

export {
  find,
  findQuery,
  findOwn,
  findById,
  findByUser,
  create,
  remove,
  // update
};
