async function postLogin(username, password) {
    const response = await fetch('/api/sessions/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
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


const loginForm = document.getElementById('login-form')

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const username = document.getElementById('email').value
    const password = document.getElementById('password').value

    try {
        const response = await postLogin(username, password)
    } catch (error) {
        console.error('Failed to login:', error)
        alert("Usuario o contraseña incorrectos")
    }
})

// document.addEventListener('DOMContentLoaded', () => {
//     const githubButton = document.getElementById('github-button')
//     githubButton.addEventListener('click', (event) => {
//         event.preventDefault()
//         window.location.href = '/api/sessions/github'
//     })
// }
// )
