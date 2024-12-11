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

    try {
        const response = await fetch(url, options);
        if (response.status === 401) {
            localStorage.clear();
            window.location.href = '/auth/login';
        }

        if (response.status === 403) {
            window.location.href = '/';
        }

        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};