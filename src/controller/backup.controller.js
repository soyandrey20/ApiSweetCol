import { google } from 'googleapis';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { Server } from 'socket.io'; // Importar Socket.IO
 

// Cargar credenciales de la cuenta de servicio
const KEYFILEPATH = '../tonal-run-437413-p7-7e94c6d27a80.json';
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});

// Inicializa el servidor de Socket.IO
export const inicializarSocket = (server) => {
    const io = new Server(server); // Asociar el servidor HTTP con Socket.IO

    io.on('connection', (socket) => {
        console.log('Cliente conectado');
    });

    return io;
};

// Función que realiza el backup
const realizarBackup = (io) => {
    return new Promise((resolve, reject) => {
        const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
        const backupPath = `C:/Backups/backup_${timestamp}.bak`;

        const command = `sqlcmd -S .\\SQLEXPRESS -Q "BACKUP DATABASE SweetCol TO DISK='${backupPath}' WITH INIT"`;

        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error al crear backup: ${stderr}`);
                return reject(stderr);
            }

            console.log(`Backup creado exitosamente: ${backupPath}`);
            resolve(backupPath);

            // Notificar a los clientes conectados
            io.emit('backupRealizado', { message: 'Backup creado exitosamente', backupPath });
        });
    });
};

// Función para subir el archivo a Google Drive
const subirBackupAGoogleDrive = async (backupPath, io) => {
    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata = {
        name: path.basename(backupPath),
        parents: ['10AZOS_6Tlnzf9U9JCVn0bManQaGfu7gg'],
    };

    const media = {
        mimeType: 'application/octet-stream',
        body: fs.createReadStream(backupPath),
    };

    try {
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });

        console.log(`Backup subido a Google Drive con ID: ${response.data.id}`);

        // Notificar a los clientes que se subió el backup a Google Drive
        io.emit('backupSubido', { message: 'Backup subido a Google Drive', backupId: response.data.id });
    } catch (err) {
        console.error(`Error al subir el backup a Google Drive: ${err}`);
    }
};

// Función para backup manual (con subida a Google Drive)
export const backupDatabase = async (  res, io) => {
    try {
        const backupPath = await realizarBackup(io);
        await subirBackupAGoogleDrive(backupPath, io);
     
    } catch (err) {
        console.error("Error al realizar el backup: ", err);
        res.status(500).json({ message: 'Error al crear o subir el backup', error: err });
    }
};



// Función para backups automáticos (Con de respuesta HTTP)
export const iniciarBackupAutomatico = (io) => {
    setInterval(async () => {
        try {
            const backupPath = await realizarBackup(io);
            await subirBackupAGoogleDrive(backupPath, io);
             
        } catch (err) {
            console.error('Error al realizar el backup automático:', err);
        }
    }, 30 * 64 * 1000); // 30 minutos
};
