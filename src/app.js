import express, { request } from 'express'; // Importamos express
import cors from 'cors'; // Importamos cors para poder hacer peticiones desde cualquier origen
import userRoutes from './routes/routes.js'; // Rutas de usuario
import backupRoutes from './routes/backup.routes.js'; // Rutas del backup
import { inicializarSocket, iniciarBackupAutomatico, backupDatabase } from './controller/backup.controller.js';
import morgan from 'morgan'; // Importamos morgan para hacer logs
import winston from 'winston'; // Importamos winston para hacer logs
const MAX_REQUESTS = 50; // Definimos el máximo de solicitudes por minuto
import http from 'http';


const app = express(); // Inicializamos express
const server = http.createServer(app);
const io = inicializarSocket(server); // Iniciar Socket.IO

app.get('/manual-backup', (req, res) => {
    backupDatabase(req, res, io);
});

app.use(cors(
    {
        origin: 'http://127.0.0.1:5500'
    }

)); // Configuramos cors para que acepte peticiones desde cualquier origen

//configuramos winston para registrar logs en un archivo
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'logs.log' }),
    ],
});

const rateLimit = (req, res, next) => {
    const ip = req.ip;
    const currentTime = Date.now();

    //almacenar la cantidad de solicitudes que ha hecho un usuario
    if (!request[ip]) {
        request[ip] = { count: 1, firstRequest: currentTime };
    } else {
        request[ip].count++;
        //verificar si ha trasncurrido un minuto desde la primera solicitud
        if (currentTime - request[ip].firstRequest < 60000) {
            if (request[ip].count > MAX_REQUESTS) {
                // Detectar intrusion y registrar el intento
                logger.warn(`Intento de intrusion detectado desde la IP: ${ip}`);
                console.log(`Intento de intrusion detectado desde la IP: ${ip}`);


                // bloquear la IP del usuario por 5 minutos
                setTimeout(() => {
                    request[ip] = { count: 1, firstRequest: currentTime };
                }, 120000);

                return res.status(429).send('Acceso bloqueado temporalmente, demasiadas solicitudes desde esta IP');
            }

        } else {
            // reiniciar el contador despues de un minuto
            request[ip] = { count: 1, firstRequest: currentTime };
        }
    }
    next();
};

//Usamos el middleware rateLimit para limitar las solicitudes
app.use(rateLimit);



//usamos morgan para registrar las solicitudes
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));


app.use(express.json()); // Configuramos express para que pueda entender json

app.use(userRoutes); // Usamos las rutas de usuario

app.use(backupRoutes); // Usamos las rutas del backup

// Iniciar backups automáticos
iniciarBackupAutomatico(io); // Iniciar backups automáticos


export default app; // Exportamos app para poder usarlo en otros archivos