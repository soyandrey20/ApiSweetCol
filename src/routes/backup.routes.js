import { Router } from 'express';
import { backupDatabase } from '../controller/backup.controller.js'; // Importamos el controlador
const router = Router();

// Definimos la ruta para realizar el backup manualmente
router.post('/backup', backupDatabase);

export default router;
