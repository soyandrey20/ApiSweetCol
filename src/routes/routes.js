import { Router } from 'express';

import { Contraseña, DataUser, Users, addDAtaUserReferences, addDataUser, addDataUserExperience, addDataUserSkill, addNewUser, loginUser, reestablecerContraseña } from '../controller/loginController.js';


const router = Router();

// aqui se definen las rutas de la aplicacion

router.get('/users', Users);
router.get('/DataUser', DataUser);

router.post('/login', loginUser)

router.post('/user', addNewUser);

router.post('/users', addDataUser)

router.post('/userSkills', addDataUserSkill)

router.post('/userReferences', addDAtaUserReferences)

router.post('/userExperiences', addDataUserExperience)

router.post('/ReestablecerContrasena', reestablecerContraseña);

router.post('/Contrasena', Contraseña);


export default router;