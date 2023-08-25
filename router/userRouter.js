import express from 'express';
import { createUserAccount, logOutUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUserAccount);
router.post('/login', loginUser);
router.post('/logout', logOutUser);


export default router;