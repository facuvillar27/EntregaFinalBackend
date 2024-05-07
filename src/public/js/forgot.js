document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forget-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;

        try {
            const response = await fetch('/api/sessions/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Error al enviar la solicitud de restablecimiento de contraseña');
            }

            const data = await response.json();
            alert('Correo enviado. Por favor, verifica tu bandeja de entrada.');
            if (result.status === 'success') {
                window.location.href = '/'
            }
        } catch (error) {
            console.error(error);
            alert('Error al enviar la solicitud de restablecimiento de contraseña');
        }
    });
});
