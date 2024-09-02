import { getConnection } from "../dataBase/connection.js";

import sql from 'mssql';
import encrypt from 'bcryptjs'; // Asegúrate de importar correctamente bcryptjs
import bcrypt from 'bcryptjs';

import { enviarCorreo } from '../mailer.js'; // Importa tu función de enviarCorreo

import crypto from 'crypto';

export const loginUser = async (req, res) => {
    try {
        // Extraer el email y la contraseña del cuerpo de la solicitud
        const { id, password } = req.body;

        // Obtener conexión a la base de datos
        const pool = await getConnection();

        // Consultar el usuario por email
        const result = await pool
            .request()
            .input('id', sql.VarChar, id)
            .query('SELECT * FROM users WHERE id = @id');

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const user = result.recordset[0];

        // Comparar la contraseña en texto plano con la contraseña encriptada
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(user.password);
        console.log(user);
        if (isMatch) {
            // Responder con éxito
            res.status(200).json({
                message: 'Inicio de sesión exitoso',
                user: {
                    id: user.id,
                    name: user.nombre,
                    email: user.email
                }
            });
        } else {
            res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
};



export const addNewUser = async (req, res) => {
    try {
        // Obtener conexión a la base de datos
        const pool = await getConnection();

        // Encriptar la contraseña
        const hash = await encrypt.hash(req.body.passwordd, 8);

        // Ejecutar la consulta SQL para insertar el nuevo usuario
        const result = await pool
            .request()
            .input('cedula', sql.VarChar, req.body.cedulaa)
            .input('username', sql.VarChar, req.body.usernamee)
            .input('email', sql.VarChar, req.body.emaill)
            .input('password', sql.VarChar, hash)
            .query('INSERT INTO users (id, nombre, email, password) VALUES (@cedula, @username, @email, @password)');

        console.log(result);

        // Responder con un código de estado 201 y un mensaje de éxito (sin incluir la contraseña)
        res.status(201).json({
            id: req.body.cedulaa,
            name: req.body.usernamee,
            email: req.body.emaill
        });

    } catch (error) {
        // Manejar errores y responder con un código de estado 500
        console.log(error);
        res.status(500).send(error.message);
    }
};


export const Users = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM Users');

        console.log(result.recordset);
        res.json(result.recordset);
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }
}
export const DataUser = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM DataUser');

        console.log(result.recordset);
        res.json(result.recordset);
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }
}
export const addUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const pool = await getConnection();
        const hash = await encrypt.hash(password, 8);
        await pool.request().input('username', sql.VarChar, username).input('password', sql.VarChar, hash).query('INSERT INTO Users (username, password) VALUES (@username, @password)');
        res.json({ username, password });
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const addDataUser = async (req, res) => {
    try {
        const { cedula, nombre, genero, estadoCivil, email, fechaNacimiento, direccion, telefono } = req.body;
        const pool = await getConnection();
        await pool.request().input('cedula', sql.VarChar, cedula).input('nombre', sql.VarChar, nombre).input('genero', sql.VarChar, genero).input('estadoCivil', sql.VarChar, estadoCivil).input('email', sql.VarChar, email).input('fechaNacimiento', sql.VarChar, fechaNacimiento).input('direccion', sql.VarChar, direccion).input('telefono', sql.VarChar, telefono).query('INSERT INTO DataUser (cedula, nombre, genero, estadoCivil, email, fechaNacimiento, direccion, telefono) VALUES (@cedula, @nombre, @genero, @estadoCivil, @email, @fechaNacimiento, @direccion, @telefono)');
        res.json({ cedula, nombre, genero, estadoCivil, email, fechaNacimiento, direccion, telefono });

    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const addDataUserSkill = async (req, res) => {
    try {
        const { dominioSoftware, herramientas, lenguajesProgramacion, comunicacion, liderazgo, trabajoEquipo, resolucionProblemas } = req.body;
        const pool = await getConnection();
        await pool.request().input('dominioSoftware', sql.VarChar, dominioSoftware).input('herramientas', sql.VarChar, herramientas).input('lenguajesProgramacion', sql.VarChar, lenguajesProgramacion).input('comunicacion', sql.VarChar, comunicacion).input('liderazgo', sql.VarChar, liderazgo).input('trabajoEquipo', sql.VarChar, trabajoEquipo).input('resolucionProblemas', sql.VarChar, resolucionProblemas).query('INSERT INTO DataUserSkill (dominioSoftware, herramientas, lenguajesProgramacion, comunicacion, liderazgo, trabajoEquipo, resolucionProblemas) VALUES (@dominioSoftware, @herramientas, @lenguajesProgramacion, @comunicacion, @liderazgo, @trabajoEquipo, @resolucionProblemas)');
        res.json({ dominioSoftware, herramientas, lenguajesProgramacion, comunicacion, liderazgo, trabajoEquipo, resolucionProblemas });



    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}


export const addDataUserExperience = async (req, res) => {
    try {
        const { titulosObtenidos, nivelEducacion, areasEstudio, empresasAnteriores, cargosDesempenados, funciones, tiempoServicio, logros } = req.body;
        const pool = await getConnection();
        await pool.request().input('titulosObtenidos', sql.VarChar, titulosObtenidos).input('nivelEducacion', sql.VarChar, nivelEducacion).input('areasEstudio', sql.VarChar, areasEstudio).input('empresasAnteriores', sql.VarChar, empresasAnteriores).input('cargosDesempenados', sql.VarChar, cargosDesempenados).input('funciones', sql.VarChar, funciones).input('tiempoServicio', sql.VarChar, tiempoServicio).input('logros', sql.VarChar, logros).query('INSERT INTO DataUserExperience (titulosObtenidos, nivelEducacion, areasEstudio, empresasAnteriores, cargosDesempenados, funciones, tiempoServicio, logros) VALUES (@titulosObtenidos, @nivelEducacion, @areasEstudio, @empresasAnteriores, @cargosDesempenados, @funciones, @tiempoServicio, @logros)');
        res.json({ titulosObtenidos, nivelEducacion, areasEstudio, empresasAnteriores, cargosDesempenados, funciones, tiempoServicio, logros });
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const addDAtaUserReferences = async (req, res) => {
    try {
        const { nombreReferencia, cargo, empresa, telefonosContacto, pruebasPsicologicas, pruebasTecnicas, pruebasConocimiento } = req.body;
        const pool = await getConnection();
        await pool.request().input('nombreReferencia', sql.VarChar, nombreReferencia).input('cargo', sql.VarChar, cargo).input('empresa', sql.VarChar, empresa).input('telefonosContacto', sql.VarChar, telefonosContacto).input('pruebasPsicologicas', sql.VarChar, pruebasPsicologicas).input('pruebasTecnicas', sql.VarChar, pruebasTecnicas).input('pruebasConocimiento', sql.VarChar, pruebasConocimiento).query('INSERT INTO DataUserReferences (nombreReferencia, cargo, empresa, telefonosContacto, pruebasPsicologicas, pruebasTecnicas, pruebasConocimiento) VALUES (@nombreReferencia, @cargo, @empresa, @telefonosContacto, @pruebasPsicologicas, @pruebasTecnicas, @pruebasConocimiento)');
        res.json({ nombreReferencia, cargo, empresa, telefonosContacto, pruebasPsicologicas, pruebasTecnicas, pruebasConocimiento });
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }
}



export const reestablecerContraseña = async (req, res) => {
    try {
        const { id } = req.body;

        // Obtener conexión a la base de datos
        const pool = await getConnection();

        // Buscar al usuario por cédula
        const result = await pool
            .request()
            .input('id', sql.VarChar, id)
            .query('SELECT * FROM users WHERE id = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = result.recordset[0];

        // Generar un token único y su expiración
        const token = crypto.randomBytes(32).toString('hex');
        const tokenExpiration = Date.now() + 3600000; // 1 hora

        // Almacenar el token y la expiración en la base de datos
        await pool
            .request()
            .input('token', sql.VarChar, token)
            .input('tokenExpiration', sql.BigInt, tokenExpiration)
            .input('id', sql.VarChar, id)
            .query('UPDATE users SET resetToken = @token, resetTokenExpiration = @tokenExpiration WHERE id = @id');

        // Crear el enlace de restablecimiento de contraseña

        const resetLink = `http://127.0.0.1:5500/Front-end/Reestablecer/Index.html?token=${token}`;
        const contenidoHtml = `
    <html>

    <body style="font-family: Arial, sans-serif; color: #333;">



        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;  text-align: center;">
            <nav>
                <p><img src="https://logosweetcol.s3.us-east-2.amazonaws.com/Logo-removebg-preview.png" alt="Logo"
                        style="max-width: 100px;"></p>
            </nav>
            <h1 style="color: #007bff;">Restablecer Contraseña</h1>
            <p>Hola ${user.nombre},</p>
            <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para
                restablecerla:</p>
            <a href="${resetLink}"
                style="display: inline-block; padding: 10px 20px; margin-top: 10px; font-size: 16px; font-weight: bold; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Reestablecer
                Contraseña</a>
            <p style="margin-top: 20px;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
            <footer style="margin-top: 20px; font-size: 12px; color: #777;">
                <p>SweetCol</p>

            </footer>
        </div>
    </body>

    </html>
    `;

        enviarCorreo(user.email, 'Restablecer Contraseña', contenidoHtml);

        // Enviar el correo de restablecimiento de contraseña

        res.status(200).json({ message: 'Correo enviado' });

    } catch (error) {
        console.error('Error al restablecer contraseña:', error);
        res.status(500).send('Error al restablecer contraseña');
    }
};

export const Contraseña = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const pool = await getConnection();

        // Obtener la fecha y hora actual
        const now = new Date();

        // Consultar el usuario por token y verificar si el token no ha expirado
        const result = await pool
            .request()
            .input('token', sql.VarChar, token)
            .input('now', sql.BigInt, now) // Usar BIGINT para timestamp
            .query(`
        SELECT * FROM users 
        WHERE resetToken = @token 
        AND resetTokenExpiration > @now
    `);

        if (result.recordset.length === 0) {
            return res.status(400).json({ message: 'Token inválido o expirado' });
        }

        const user = result.recordset[0];

        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 8);

        // Actualizar la contraseña del usuario
        await pool
            .request()
            .input('id', sql.VarChar, user.id)
            .input('password', sql.VarChar, hashedPassword)
            .query('UPDATE users SET password = @password, resetToken = NULL, resetTokenExpiration = NULL WHERE id = @id');

        res.status(200).json({ message: 'Contraseña actualizada exitosamente' });

    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        res.status(500).send('Error al restablecer la contraseña');
    }
};
