document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reset-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const password1 = document.getElementById('password1').value;
        const password2 = document.getElementById('password2').value;

        if (password1 !== password2) {
            alert('Las contraseñas no coinciden');
            return;
        }

        const pathSegments = window.location.pathname.split('/');
        const resetPasswordToken = pathSegments[pathSegments.length - 1];

        try {
            const body = { password: password1 }
            const url = `/api/sessions/reset/${resetPasswordToken}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
        });

        if (!response.ok) {
            const result = await response.json();
            if (result.error === "Password must be different") {
                alert('La contraseña debe ser diferente a la anterior');
                return;
            }
            throw new Error('Error al enviar la solicitud de restablecimiento de contraseña');
        }

        if (!response.ok) {
            throw new Error('Error al enviar la solicitud de restablecimiento de contraseña');
        }

        const result = await response.json();
        alert('Contraseña restablecida con éxito');
        window.location.href = '/';
        } catch (error) {
            console.error(error);
            alert('Error al restablecer la contraseña');
        }   
    });
});
