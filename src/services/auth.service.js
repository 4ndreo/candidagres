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

// async function auth(user) {
//     return fetchWithInterceptor(url + 'users/auth', {
//         method: 'POST',
//         // headers: {
//         //     'Content-Type': 'application/json',
//         //     'auth-token': localStorage.getItem('token')
//         // },
//         body: user
//     })
//         .then(response => {
//             if (response.status === 200) {
//                 return response.json()
//             }
//             throw new Error('Error de autenticación')
//         })
// }

export {
    login,
    restorePassword,
    verifyEmail,
    changePassword,
}