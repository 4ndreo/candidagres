export const fetchWithInterceptor = async (url, options = {}) => {
    // Agregar el token a los encabezados
    const token = localStorage.getItem('token');
    if (token) {
        options.headers = {
            ...options.headers,
            'Content-Type': 'application/json',
            'auth-token': token
        };
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