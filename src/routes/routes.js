import { Router } from 'express';

import { Contraseña, DataUser, User, Users, addContrato, addDAtaUserReferences, addDataUser, addDataUserExperience, addDataUserSkill, addNewUser, addNomina, informationGastosAnuales, informationSexDashboard, informationStudysDashboard, informationYearOldDashboard, loginUser, reestablecerContraseña, reportUser } from '../controller/loginController.js';


const router = Router();

// aqui se definen las rutas de la aplicacion

router.get('/users', Users);

router.get('/DataUser', DataUser);

router.get('/user/:id', User);

router.get('/genero', informationSexDashboard)

router.get('/edad', informationYearOldDashboard)

router.get('/gastos-anuales', informationGastosAnuales)

router.get('/nivel-estudios',informationStudysDashboard)

router.post('/DataNomina', addNomina);

router.post('/contratos', addContrato);

router.post('/login', loginUser)

router.post('/user', addNewUser);

router.post('/users', addDataUser)

router.post('/userSkills', addDataUserSkill)

router.post('/userReferences', addDAtaUserReferences)

router.post('/userExperiences', addDataUserExperience)

router.post('/ReestablecerContrasena', reestablecerContraseña);

router.post('/Contrasena', Contraseña);

router.get('/export-pdf', reportUser);

export default router;