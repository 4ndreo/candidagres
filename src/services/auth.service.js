import { fetchWithInterceptor } from "../interceptors/auth";

const url = process.env.REACT_APP_API_URL

async function login(email, password) {
    return fetch(url + 'auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    }).then((response) => response.json());
}

async function register(user) {
    return fetchWithInterceptor(url + "users", {
        method: "POST",
        body: JSON.stringify(user),
    }).then((response) => response.json());
}

async function restorePassword(email) {
    return fetch(url + 'auth/restorePassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
    }).then((response) => response.json());

}

async function verifyEmail(id, verificationCode) {
    return fetch(url + 'auth/verifyEmailCode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, verificationCode })
    }).then((response) => response.json());

}

async function changePassword(id, verificationCode, data) {
    return fetch(url + 'auth/changePassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, verificationCode, password: data.password, confirm_password: data.confirm_password })
    }).then((response) => response.json());

}

async function updateProfile(idUser, user) {
    return fetchWithInterceptor(url + "profile/" + idUser, {
        method: "PATCH",
        headers: {
            'X-Type': 'image',
        },
        body: user,
    }).then((response) => response.json())
        .catch(() => { throw new Error('Error: no se pudo modificar. Inténtelo de nuevo más tarde') });
}

export {
    login,
    register,
    restorePassword,
    verifyEmail,
    changePassword,
    updateProfile,
}