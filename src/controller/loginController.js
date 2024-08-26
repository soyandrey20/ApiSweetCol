import { getConnection } from "../dataBase/connection.js";
import sql from 'mssql';



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
        
         
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}
