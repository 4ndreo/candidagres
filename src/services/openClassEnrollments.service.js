import { fetchWithInterceptor } from "../interceptors/auth";

const url = process.env.REACT_APP_API_URL

async function create(user) {
    return fetchWithInterceptor(url + "openClassEnrollments", {
        method: "POST",
        body: JSON.stringify(user),
    }).then((response) => response.json());
}

async function findQuery(request, signal) {
    // Construct the full URL
    const fullUrl = new URL(url + "openClassEnrollments");
  
    // Add query parameters to the URL
    Object.entries(request).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => fullUrl.searchParams.append(key, v));
      } else {
        fullUrl.searchParams.append(key, value);
      }
    });
  
    return fetchWithInterceptor(fullUrl, {
      signal
    }).then((response) => response.json()
    ).catch(() => { throw new Error('Error: no se pudieron obtener los registros. Inténtelo de nuevo más tarde') });
  }
  

export {
    create,
    findQuery,
}