async function postRest(password) {
    const rid = window.location.pathname.split('/').pop()
    const response = await fetch(`/api/sessions/reset/${rid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }


}

const resetForm = document.getElementById('reset-form')

resetForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const password1 = document.getElementById('password1').value
    const password2 = document.getElementById('password2').value

    if (password1 !== password2) {
        alert('Las contraseñas no coinciden')
        return
    }

    try {
        const response = await postRest(password1)
        alert('Contraseña restablecida')
        window.location.href = '/'
    } catch (error) {
        console.error('Failed to reset:', error)
        alert("Error al restablecer la contraseña")
    }
})




