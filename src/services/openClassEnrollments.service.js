import { fetchWithInterceptor } from "../interceptors/auth";

const url = process.env.REACT_APP_API_URL

async function create(user) {
    return fetchWithInterceptor(url + "openClassEnrollments", {
        method: "POST",
        body: JSON.stringify(user),
    }).then((response) => response.json());
}

export {
    create,
}