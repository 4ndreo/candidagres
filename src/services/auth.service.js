async function login (email, password){
    return fetch('http://localhost:2025/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
  //          'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYjg5YWVlZjQ0ZGVkZmU2MDYxZDA5MSIsIm5hbWUiOiJSb25pIiwiaWF0IjoxNjU2MjcxOTQ1fQ.FCyO_jzrgYMxkiczyFxDKlU3FqqQFhVry4WH7Hw3IMA'
        },
        body: JSON.stringify({email, password})
    })
        .then(response => {
            if(response.status === 200){
                return response.json()
            }
            
            throw new Error('Las credenciales son incorrectas.');
        })
}

async function auth (user){
    return fetch('http://localhost:2025/api/users/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        },
        body: user
    })
        .then(response => {
            if(response.status === 200){
                return response.json()
            }
            throw new Error('Error de autenticación')
        })
}

export {
    login,
    auth
}