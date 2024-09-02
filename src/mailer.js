import nodemailer from 'nodemailer';

// Configura el transportador de Nodemailer
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Usa `true` para el puerto 465, `false` para otros puertos
    auth: {
        user: 'burgaandrey@gmail.com',
        pass: "ynprotwqaolkqatj",
    },
});

// Función para enviar el correo
export function enviarCorreo(destinatario, asunto, contenidoHtml) {
    const mailOptions = {
        from: 'burgaandrey@gmail.com',
        to: destinatario,
        subject: asunto,
        html: contenidoHtml // Usa el campo `html` para contenido HTML
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error al enviar el correo:', error);
        } else {
            console.log('Correo enviado:', info.response);
        }
    });
}
