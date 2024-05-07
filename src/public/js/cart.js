document.addEventListener('DOMContentLoaded', function() {
    const buyButton = document.querySelector('.buy');

    buyButton.addEventListener('click', async function(event) {
        event.preventDefault(); 

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Error placing order');
            }
            const result = await response.json();
            console.log('Orden creada con éxito:', result);
            window.location.href = '/perfil';
        } catch (error) {
            console.error('Error placing order:', error);
        }
    });
})


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