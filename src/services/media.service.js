import { fetchWithInterceptor } from "../interceptors/auth";

const url = process.env.REACT_APP_API_URL

async function uploadImagen(imagen) {
    const formData = new FormData();
    formData.append('productImg', imagen);

    return fetchWithInterceptor(url + "media", {
        method: "POST",
        headers: {
            'X-Type': 'image',
        },
        body: formData,
    }).then((response) => response.json());
}

async function removeImage(fileName) {
    return fetchWithInterceptor(url + "media/" + fileName, {
        method: "DELETE",
    }).then((response) => response.json());
}

export { uploadImagen, removeImage };
