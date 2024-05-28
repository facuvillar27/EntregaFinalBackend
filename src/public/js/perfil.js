let addProducts = document.getElementsByClassName('agregar')

for (let products of addProducts) {
    products.addEventListener('click', async (e) => {
        let pid = e.target.id
        let response = await fetch(`/api/carts/product/${pid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        let data = await response.json()
        if (data.message === 'User cannot add own product to cart') {
            alert('No puedes agregar tu propio producto al carrito')
        }
        else {
            alert('Producto agregado al carrito')
        }
    })
}
