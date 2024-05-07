async function postLogout() {
    const response = await fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        window.location.href = '/login';
    } else {
        alert('Hubo un error al cerrar la sesión');
    }
}

const logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', async () => {
    try {
        postLogout();
    } catch (error) {
        console.error('Error:', error);
    }
});