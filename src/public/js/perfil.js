let addProducts = document.getElementsByClassName('agregar')

for (let products of addProducts) {
    products.addEventListener('click', async (e) => {
        let pid = e.target.id
        let response = await fetch(`/api/users/product/${pid}`, {
            method: 'PUT',
        })
        let data = await response.json()
        if (data.status === 'success') {
            window.location.reload()
        }
    })
}

document.addEventListener('DOMContentLoaded', function() {
    let emptyCartButton = document.querySelector('.emptyCartButton');

    if (emptyCartButton) {
        emptyCartButton.addEventListener('click', async () => {
            try {
                let response = await fetch('/api/users/empty-cart', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token') // Asegúrate de que el token esté almacenado y se utilice correctamente
                    }
                });
                let data = await response.json();
                if (data.status === 'success') {
                    window.location.reload();
                } else {
                    console.error(data.error);
                }
            } catch (error) {
                console.error('Error emptying cart:', error);
            }
        });
    }
});