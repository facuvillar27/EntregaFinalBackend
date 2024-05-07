async function postLogin(username, password) {
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    const data = await response.json()
    if (data.respuesta === 'Login OK') {
        window.location.href = '/session'
    } else {
        alert('Usuario o contraseña incorrecta')
    }
}

const loginForm = document.getElementById('login-form')

loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    postLogin(username, password)
})