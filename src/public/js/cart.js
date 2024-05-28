document.addEventListener('DOMContentLoaded', function() {
    const buyButton = document.querySelector('.buy');

    buyButton.addEventListener('click', async function(event) {
        event.preventDefault();
        const cid = event.target.id;
        try {
            const response = await fetch(`/api/carts/${cid}/purchase`, {
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
        emptyCartButton.addEventListener('click', async (e) => {
            let cid = e.target.id;
            try {
                let response = await fetch(`/api/carts/emptyCart/${cid}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                let data = await response.json();
                console.log(data)
                if (!response.ok) {
                    throw new Error('Error emptying cart');
                }
                window.location.reload();
            } catch (error) {
                console.error('Error emptying cart:', error);
            }
        });
    }
});