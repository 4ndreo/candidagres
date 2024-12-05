import { fetchWithInterceptor } from "../interceptors/auth";

const url = process.env.REACT_APP_API_URL

async function find(signal) {
  return fetchWithInterceptor(url + "usersAll", {
    signal
  }).then((response) => response.json())
    .catch((err) => { return err });
}


async function findQuery(request, signal) {
  // Construct the full URL
  const fullUrl = new URL(url + "users");

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

async function findById(idUser, signal) {
  return fetchWithInterceptor(url + "users/" + idUser, {
    signal
  }).then((response) =>
    response.json()
  );
}

async function create(user) {
  return fetchWithInterceptor(url + "users", {
    method: "POST",
    body: JSON.stringify(user),
  }).then((response) => response.json());
}

async function remove(idUser) {
  return fetchWithInterceptor(url + "users/" + idUser, {
    method: "DELETE",
  }).then((response) => response.json());
}

async function update(idUser, user) {
  return fetchWithInterceptor(url + "users/" + idUser, {
    method: "PATCH",
    body: JSON.stringify(user),
  }).then((response) => response.json());
}


export { find, findQuery, findById, create, remove, update };
