import { fetchWithInterceptor } from "../interceptors/auth";

const url = process.env.REACT_APP_API_URL

async function find(signal) {
  return fetchWithInterceptor(url + "users", {
    signal
  }).then((response) => response.json())
    .catch((err) => { return err });
}

async function findById(idUser, signal) {
  return fetchWithInterceptor(url + "users/" + idUser, {
    signal
  }).then((response) =>
    response.json()
  );
}

async function create(user) {
  return fetchWithInterceptor(url + "users/user", {
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
  console.log(user)
  return fetchWithInterceptor(url + "users/" + idUser, {
    method: "PATCH",
    body: JSON.stringify(user),
  }).then((response) => response.json());
}

async function updateProfile(idUser, user) {
  console.log(user)
  return fetchWithInterceptor(url + "profile/" + idUser, {
    method: "PATCH",
    body: JSON.stringify(user),
  }).then((response) => response.json());
}

export { find, findById, create, remove, update, updateProfile };
