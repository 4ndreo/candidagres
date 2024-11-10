export const fetchWithInterceptor = async (url, options = {}) => {
    // Agregar el token a los encabezados
    const token = localStorage.getItem('token');
    if (token) {
        console.log('PRUEBA');
        // console.log(JSON.stringify(options.headers !== undefined ? options.headers['Content-Type'] : 'NAD'));
        if (options.headers === undefined) {
            options.headers = {
                ...options.headers,
                'Content-Type': 'application/json',
                'auth-token': token
            };
        } else {
            options.headers = {
                ...options.headers,
                // 'Content-Type': undefined,
                'auth-token': token
            };
            
        }
    }

    try {
        const response = await fetch(url, options);

        // Manejar respuestas
        if (response.status === 401) {
            // Manejar el error de autenticación, por ejemplo, redirigir al login
            window.location.href = '/auth/login';
        }

        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};