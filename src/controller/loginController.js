import { getConnection } from "../dataBase/connection.js";

import sql from 'mssql';
import encrypt from 'bcryptjs'; // Asegúrate de importar correctamente bcryptjs
import bcrypt from 'bcryptjs';

import { enviarCorreo, enviarCorreoConPDF } from '../mailer.js'; // Importa tu función de enviarCorreo

import crypto from 'crypto';


import pdf from 'html-pdf';

export const loginUser = async (req, res) => {
    try {
        // Extraer el id y la contraseña del cuerpo de la solicitud
        const { id, password } = req.body;

        // Obtener conexión a la base de datos
        const pool = await getConnection();

        // Consultar el usuario por id
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
export const User = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.VarChar, id)
            .query('SELECT * FROM Users WHERE id = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ nombre: result.recordset[0].nombre });
    }
    catch (error) {
        res.status(500).send(error.message);
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
        await pool.request()
            .input('cedula', sql.VarChar, cedula)
            .input('nombre', sql.VarChar, nombre)
            .input('genero', sql.VarChar, genero)
            .input('estadoCivil', sql.VarChar, estadoCivil)
            .input('email', sql.VarChar, email)
            .input('fechaNacimiento', sql.VarChar, fechaNacimiento)
            .input('direccion', sql.VarChar, direccion)
            .input('telefono', sql.VarChar, telefono)
            .input('contratado', sql.Bit, false)
            .query('INSERT INTO DataUser (cedula, nombre, genero, estadoCivil, email, fechaNacimiento, direccion, telefono, contratado) VALUES (@cedula, @nombre, @genero, @estadoCivil, @email, @fechaNacimiento, @direccion, @telefono, @contratado)');
        res.json({ cedula, nombre, genero, estadoCivil, email, fechaNacimiento, direccion, telefono });

    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const addDataUserSkill = async (req, res) => {
    try {
        const { cedula, dominioSoftware, herramientas, lenguajesProgramacion, comunicacion, liderazgo, trabajoEquipo, resolucionProblemas } = req.body;
        const pool = await getConnection();
        await pool.request()
            .input('cedula', sql.VarChar, cedula)
            .input('dominioSoftware', sql.VarChar, dominioSoftware)
            .input('herramientas', sql.VarChar, herramientas)
            .input('lenguajesProgramacion', sql.VarChar, lenguajesProgramacion)
            .input('comunicacion', sql.VarChar, comunicacion)
            .input('liderazgo', sql.VarChar, liderazgo)
            .input('trabajoEquipo', sql.VarChar, trabajoEquipo)
            .input('resolucionProblemas', sql.VarChar, resolucionProblemas)
            .query('INSERT INTO DataUserSkill (cedula,dominioSoftware, herramientas, lenguajesProgramacion, comunicacion, liderazgo, trabajoEquipo, resolucionProblemas) VALUES (@cedula,@dominioSoftware, @herramientas, @lenguajesProgramacion, @comunicacion, @liderazgo, @trabajoEquipo, @resolucionProblemas)');
        res.json({ dominioSoftware, herramientas, lenguajesProgramacion, comunicacion, liderazgo, trabajoEquipo, resolucionProblemas });



    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}


export const addDataUserExperience = async (req, res) => {
    try {
        const { cedula, titulosObtenidos, nivelEducacion, areasEstudio, empresasAnteriores, cargosDesempenados, funciones, tiempoServicio, logros } = req.body;
        const pool = await getConnection();
        await pool.request()
            .input('cedula', sql.VarChar, cedula)
            .input('titulosObtenidos', sql.VarChar, titulosObtenidos)
            .input('nivelEducacion', sql.VarChar, nivelEducacion)
            .input('areasEstudio', sql.VarChar, areasEstudio)
            .input('empresasAnteriores', sql.VarChar, empresasAnteriores)
            .input('cargosDesempenados', sql.VarChar, cargosDesempenados)
            .input('funciones', sql.VarChar, funciones)
            .input('tiempoServicio', sql.VarChar, tiempoServicio)
            .input('logros', sql.VarChar, logros)
            .query('INSERT INTO DataUserExperience (cedula,titulosObtenidos, nivelEducacion, areasEstudio, empresasAnteriores, cargosDesempenados, funciones, tiempoServicio, logros) VALUES (@cedula,@titulosObtenidos, @nivelEducacion, @areasEstudio, @empresasAnteriores, @cargosDesempenados, @funciones, @tiempoServicio, @logros)');
        res.json({ titulosObtenidos, nivelEducacion, areasEstudio, empresasAnteriores, cargosDesempenados, funciones, tiempoServicio, logros });
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const addDAtaUserReferences = async (req, res) => {
    try {
        const { cedula, nombreReferencia, cargo, empresa, telefonosContacto, pruebasPsicologicas, pruebasTecnicas, pruebasConocimiento } = req.body;
        const pool = await getConnection();
        await pool.request()
            .input('cedula', sql.VarChar, cedula)
            .input('nombreReferencia', sql.VarChar, nombreReferencia)
            .input('cargo', sql.VarChar, cargo)
            .input('empresa', sql.VarChar, empresa)
            .input('telefonosContacto', sql.VarChar, telefonosContacto)
            .input('pruebasPsicologicas', sql.VarChar, pruebasPsicologicas)
            .input('pruebasTecnicas', sql.VarChar, pruebasTecnicas)
            .input('pruebasConocimiento', sql.VarChar, pruebasConocimiento)
            .query('INSERT INTO DataUserReferences (cedula,nombreReferencia, cargo, empresa, telefonosContacto, pruebasPsicologicas, pruebasTecnicas, pruebasConocimiento) VALUES (@cedula, @nombreReferencia, @cargo, @empresa, @telefonosContacto, @pruebasPsicologicas, @pruebasTecnicas, @pruebasConocimiento)');
        res.json({ nombreReferencia, cargo, empresa, telefonosContacto, pruebasPsicologicas, pruebasTecnicas, pruebasConocimiento });
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const addContrato = async (req, res) => {
    try {
        const { empleado_id, puesto, tipo_contrato, salario, duracion_contrato, fecha_inicio, fecha_fin, clausulas, firma_empleado, firma_empleador, estado_contrato } = req.body;
        const pool = await getConnection();
        const result = await pool.request()
            .input('empleado_id', sql.VarChar, empleado_id)
            .input('puesto', sql.VarChar, puesto)
            .input('tipo_contrato', sql.VarChar, tipo_contrato)
            .input('salario', sql.Decimal(10, 2), salario)
            .input('duracion_contrato', sql.Int, duracion_contrato || null)
            .input('fecha_inicio', sql.Date, fecha_inicio)
            .input('fecha_fin', sql.Date, fecha_fin || null)
            .input('clausulas', sql.Text, clausulas)
            .input('firma_empleado', sql.Bit, firma_empleado)
            .input('firma_empleador', sql.Bit, firma_empleador)
            .input('estado_contrato', sql.VarChar, estado_contrato || 'Activo')
            .query(`
                INSERT INTO Contratos (empleado_id, puesto, tipo_contrato, salario, duracion_contrato, fecha_inicio, fecha_fin, clausulas, firma_empleado, firma_empleador, estado_contrato)
                VALUES (@empleado_id, @puesto, @tipo_contrato, @salario, @duracion_contrato, @fecha_inicio, @fecha_fin, @clausulas, @firma_empleado, @firma_empleador, @estado_contrato)
            `);


        res.status(201).json({ message: 'Contrato creado exitosamente' });

    } catch (error) {
        console.error('Error al crear contrato:', error);
        res.status(500).send('Error al crear contrato');
    }
};

export const addNomina = async (req, res) => {
    try {


        const { cedula, salario, bonificacion, deduccion, fechapago } = req.body;
        const pool = await getConnection();
        const result = await pool.request()
            .input('cedula', sql.VarChar, cedula)
            .input('salario', sql.Decimal(10, 2), salario)
            .input('bonificacion', sql.Decimal(10, 2), bonificacion)
            .input('deduccion', sql.Decimal(10, 2), deduccion)
            .input('fechapago', sql.Date, fechapago)

            .query(` INSERT INTO Nomina (IdEmpleado, SalarioBase, Bonificaciones, Deducciones, FechaPago ) VALUES (@cedula, @salario, @bonificacion, @deduccion, @fechapago)`);
        res.status(201).json({ message: 'Nomina creada exitosamente' });

    } catch (error) {
        console.error('Error al crear nomina:', error);
        res.status(500).send('Error al crear nomina');
    }
};



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

export const reportUser = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM DataUser');
        const result2 = await pool.request().query('SELECT * FROM DataUserSkill');
        const result3 = await pool.request().query('SELECT * FROM DataUserReferences');

        const data = result.recordset;
        const data2 = result2.recordset;
        const data3 = result3.recordset;

        console.log(data);
        // Combinar los datos basados en el userId (o el campo que corresponda)
        const combinedData = data.map(user => {
            if (user.contratado === false) {
                const skills = data2.find(skill => skill.cedula === user.cedula) || {};
                const references = data3.find(ref => ref.cedula === user.cedula) || {};
                return {
                    ...user,
                    skills,
                    references,
                };
            }
        }).filter(user => user !== undefined);





        // Generar el contenido del PDF (puedes personalizar el HTML)
        const htmlContent = `
            <div style="text-align: center;">
                <img src="https://logosweetcol.s3.us-east-2.amazonaws.com/Logo-removebg-preview.png" alt="Logo SweetCol" style="width: 150px;"/>
                <h2>SweetCol</h2>
                <p>Fecha: ${new Date().toLocaleDateString()}</p>
            </div>
        
            <hr style="border: 1px solid #000; margin-top: 20px;">
        
            <h3 style="text-align: center; margin-top: 20px;">Informe de Usuarios Registrados</h3>
        
            <p style="font-family: Helvetica, Arial, sans-serif;font-size: 18px; text-align: justify; margin: 20px 0;">
                En SweetCol, valoramos la integridad y el bienestar de nuestro equipo humano. Por ello, llevamos un registro exhaustivo de los datos personales y profesionales de cada uno de los empleados, con el fin de garantizar un manejo adecuado y seguro de la información. Este informe refleja el conjunto de usuarios registrados en nuestro sistema hasta la fecha, con un resumen de sus datos relevantes.
            </p>
        
            <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; max-width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px;">
                <thead>
                    <tr>
                        <th colspan="4" style="background-color: #f2f2f2; text-align: center;">Datos Personales</th>
                        <th colspan="7" style="background-color: #f2f2f2; text-align: center;">Puntajes</th>
                    </tr>
                    <tr style="background-color: #f2f2f2; text-align: center;">
                        <th style="width: 10%;">Cédula</th>
                        <th style="width: 15%;">Nombre</th>
                        <th style="width: 20%;">Email</th>
                        <th style="width: 15%;">Teléfono</th>
                        <th style="width: 8%;">Psicológico</th>
                        <th style="width: 8%;">Técnico</th>
                        <th style="width: 8%;">P. Conocimiento</th>
                        <th style="width: 8%;">Comunicación</th>
                        <th style="width: 8%;">Liderazgo</th>
                        <th style="width: 8%;">Trabajo en Equipo</th>
                        <th style="width: 8%;">Resolución de Problemas</th>
                    </tr>
                </thead>
                <tbody>
                    ${combinedData.map(user => `
                        <tr style="text-align: center;">
                            <td>${user.cedula}</td>
                            <td>${user.nombre}</td>
                            <td>${user.email}</td>
                            <td>${user.telefono}</td>
                            <td>${user.references.pruebasPsicologicas || 'N/A'}</td>
                            <td>${user.references.pruebasTecnicas || 'N/A'}</td>
                            <td>${user.references.pruebasConocimiento || 'N/A'}</td>
                            <td>${user.skills.comunicacion || 'N/A'}</td>
                            <td>${user.skills.liderazgo || 'N/A'}</td>
                            <td>${user.skills.trabajoEquipo || 'N/A'}</td>
                            <td>${user.skills.resolucionProblemas || 'N/A'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        
            <footer style="text-align: center; margin-top: 30px; font-family: Helvetica, Arial, sans-serif;font-size: 16px;">
                <p>Este informe ha sido generado automáticamente por el sistema de gestión de SweetCol. Cualquier duda o consulta, favor de dirigirse al departamento de Recursos Humanos.</p>
                <p><strong>SweetCol - Todos los derechos reservados</strong></p>
            </footer>
        `;




        // Configurar opciones para el PDF (opcional)
        const options = { format: 'A4' };

        // Generar el PDF y enviarlo al navegador
        pdf.create(htmlContent, options).toBuffer((err, buffer) => {
            if (err) {
                console.error('Error al generar el PDF:', err);
                return res.status(500).send('Error al generar el PDF');
            }

            // Configurar el encabezado para la descarga
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=DataUser.pdf');

            // Enviar el archivo PDF como respuesta para que se descargue
            res.send(buffer);

            // Enviar el PDF por correo
            enviarCorreoConPDF('jhonyandreyburga@gmail.com', 'Informe de Usuarios Registrados', htmlContent, buffer);
        });

    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const informationSexDashboard = async (req, res) => {

    try {
        // Obtener conexión a la base de datos
        const pool = await getConnection();

        // Realizar consulta a la base de datos
        const result = await sql.query(`
      SELECT 
        CASE WHEN genero = 'Masculino' THEN 'Hombre' 
             WHEN genero = 'Femenino' THEN 'Mujer' 
             ELSE 'Otro' 
        END as genero,
        COUNT(*) as total 
      FROM DataUser
      GROUP BY genero;
    `);

        // Enviar el resultado en formato JSON
        res.json(result.recordset);
    } catch (err) {
        console.error("Error al ejecutar consulta: ", err);
        res.status(500).send("Error en el servidor");
    }
};

export const informationYearOldDashboard = async (req, res) => {

    try {
        // Obtener conexión a la base de datos
        const pool = await getConnection();

        // Realizar consulta a la base de datos
        const result = await sql.query(`
        SELECT 
            DATEDIFF(YEAR, fechaNacimiento, GETDATE()) as edad,
            COUNT(*) as total
        FROM DataUser
        GROUP BY DATEDIFF(YEAR, fechaNacimiento, GETDATE())
        ORDER BY edad;
        `);

        // Enviar el resultado en formato JSON
        res.json(result.recordset);
    } catch (err) {
        console.error("Error al ejecutar consulta: ", err);
        res.status(500).send("Error en el servidor");
    }
};


export const informationGastosAnuales = async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool.query(`
        SELECT 
             FORMAT(FechaPago, 'MMMM', 'es-ES') AS Mes,
            SUM(SalarioNeto) as GastoReal,
            PresupuestoMensual as GastoPrevisto
        FROM Nomina 
        LEFT JOIN PresupuestoMensual ON MONTH(Nomina.FechaPago) = PresupuestoMensual.Mes
        WHERE YEAR(FechaPago) = YEAR(GETDATE())
        GROUP BY DATENAME(MONTH, FechaPago), PresupuestoMensual, FechaPago
        ORDER BY MONTH(FechaPago);
      `);
        res.json(result.recordset);
    } catch (err) {
        console.error("Error al ejecutar consulta: ", err);
        res.status(500).send("Error en el servidor");
    }
};

export const informationStudysDashboard = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.query(`
        SELECT 
            areasEstudio,
            COUNT(*) as total
        FROM DataUserExperience
        GROUP BY areasEstudio;
      `);
        res.json(result.recordset);
    } catch (err) {
        console.error("Error al ejecutar consulta: ", err);
        res.status(500).send("Error en el servidor");
    }
};
