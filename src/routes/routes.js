import { Router } from 'express';

import { Users, addDataUser, addDataUserSkill } from '../controller/loginController.js';


const router = Router();

router.get('/users', Users);
router.post('/users', addDataUser)
router.post('userSkills', addDataUserSkill)
    

export default router;