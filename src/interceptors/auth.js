export const fetchWithInterceptor = async (url, options = {}) => {
    // Agregar el token a los encabezados
    const token = localStorage.getItem('token');
    if (options.headers === undefined) {
        options.headers = {
            'Content-Type': 'application/json',
        };
    }
    if (token) {
        options.headers = {
            ...options.headers,
            'auth-token': token
        };
    }
    // if (token) {
    //     if (options.headers === undefined) {
    //         console.log('no hay headers', token)
    //         options.headers = {
    //             ...options.headers,
    //             'Content-Type': 'application/json',
    //             'auth-token': token
    //         };
    //     } else {
    //         options.headers = {
    //             ...options.headers,
    //             // 'Content-Type': undefined,
    //             'auth-token': token
    //         };

    //     }
    // } else {
    //     console.log('no hay token', token)
    //     options.headers = {
    //         ...options.headers,
    //         'Content-Type': 'application/json',
    //     };
    // }

    try {
        const response = await fetch(url, options);
        if (response.status === 401) {
            localStorage.clear();
            window.location.href = '/auth/login';
        }

        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};