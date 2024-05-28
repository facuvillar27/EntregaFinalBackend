async function postLogout() {
    const response = await fetch('/api/sessions/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }

    window.location.href = '/';
}

const logoutButton = document.getElementById('logout-btn');

logoutButton.addEventListener('click', async () => {
    try {
        const response = await postLogout();
    } catch (error) {
        console.error('Error:', error);
    }
});