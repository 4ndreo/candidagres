/**
* Calcula el monto total del carrito. El cálculo se hace sumando el producto del precio y cantidad de cada producto.
*
* @param {Array} items - El arreglo de productos en el carrito.
* @return {void} La función no retorna ningún valor.
*/
export function calculateTotalCost(items) {
    let total = 0
    items.forEach(producto => {
        total += producto.price * producto.quantity
    })
    return total;
}

/**
* Calcula el monto total del carrito. El cálculo se hace sumando el producto del precio y cantidad de cada producto.
*
* @param {Array} items - El arreglo de productos en el carrito.
* @return {void} La función no retorna ningún valor.
*/
export function calculateTotalQuantity(items) {
    let total = 0
    items.forEach(producto => {
        total += producto.quantity
    })
    return total;
}

/**
* Calcula la demora de la entrega de los productos. El cálculo se hace tomando la mayor de las demoras de todos los productos, y se le suma la cantidad total de items del carrito.
*
* @param {Array} items - El arreglo de productos en el carrito.
* @return {void} La función no retorna ningún valor.
*/
export function calculateDelay(items) {
    let total = 0;
    if (items.length > 0) {
        total = items.map((x) => x.estimated_delay).reduce((a, b) => a > b ? a : b)
        items.forEach(producto => {
            total += producto.quantity
        })
    }
    return total;
}

export const weekdays = [
    { id: "D1", name: "Lunes", },
    { id: "D2", name: "Martes", },
    { id: "D3", name: "Miércoles", },
    { id: "D4", name: "Jueves", },
    { id: "D5", name: "Viernes", },
];

export const getNestedProperty = (obj, key) => {
    return key.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
};