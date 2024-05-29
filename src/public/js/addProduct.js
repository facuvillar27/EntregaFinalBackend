async function postProduct(title, description, price, code, stock, thumbnail, category) {
    const response = await fetch('/api/products/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, price, code, stock, thumbnail, category})
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }

    const data = await response.json();

    if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
    }

    return data;
}


const loginForm = document.getElementById('add-product-form')

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const title = document.getElementById('title').value
    const description = document.getElementById('description').value
    const price = document.getElementById('price').value
    const code = document.getElementById('code').value
    const stock = document.getElementById('stock').value
    const thumbnail = document.getElementById('thumbnail').value
    const category = document.getElementById('category').value

    try {
        const response = await postProduct(title, description, price, code, stock, thumbnail, category)
        alert('Producto agregado')
        window.location.href = '/perfil'
    } catch (error) {
        console.error('Failed to login:', error)
        alert("Producto no agregado")
    }
})