const url = process.env.REACT_APP_API_URL

async function uploadImagen(imagen) {
    const formData = new FormData();
    formData.append('imagenProducto', imagen);

    return fetch(url + "media", {
        method: "POST",
        headers: {
            'auth-token': localStorage.getItem('token')
        },
        body: formData,
    }).then((response) => response.json());
}

export { uploadImagen };
