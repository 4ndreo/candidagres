import { fetchWithInterceptor } from "../interceptors/auth";

const url = process.env.REACT_APP_API_URL

async function login(email, password) {
    return fetch(url + 'users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    }).then((response) => response.json());

}

async function auth(user) {
    return fetchWithInterceptor(url + 'users/auth', {
        method: 'POST',
        // headers: {
        //     'Content-Type': 'application/json',
        //     'auth-token': localStorage.getItem('token')
        // },
        body: user
    })
        .then(response => {
            if (response.status === 200) {
                return response.json()
            }
            throw new Error('Error de autenticación')
        })
}

export {
    login,
    auth
}