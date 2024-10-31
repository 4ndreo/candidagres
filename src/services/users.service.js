const url = process.env.REACT_APP_API_URL

async function find() {
  return fetch(url + "users", {
    headers: {
      'auth-token': localStorage.getItem('token')
    }
  }).then((response) => response.json())
  .catch((err) => {return err});
}

async function findById(idUser) {
  return fetch(url + "users/" + idUser, {
    headers: {
      'auth-token': localStorage.getItem('token')
    }
  }).then((response) =>
    response.json()
  );
}

async function create(user) {
  return fetch(url + "users/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'auth-token': localStorage.getItem('token')
    },
    body: JSON.stringify(user),
  }).then((response) => response.json());
}

async function remove(idUser) {
  return fetch(url + "users/" + idUser, {
    method: "DELETE",
    headers: {
      'auth-token': localStorage.getItem('token')
    }
  }).then((response) => response.json());
}

async function update(idUser, user) {
  console.log(user)
  return fetch(url + "users/" + idUser, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      'auth-token': localStorage.getItem('token')
    },
    body: JSON.stringify(user),
  }).then((response) => response.json());
}

async function updateProfile(idUser, user) {
  console.log(user)
  return fetch(url + "profile/" + idUser, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      'auth-token': localStorage.getItem('token')
    },
    body: JSON.stringify(user),
  }).then((response) => response.json());
}

export { find, findById, create, remove, update, updateProfile };
