import { Router } from 'express';
import { register, login,verifyEmail,verifyCode,changePassword } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', verifyEmail); // <-- esta es la nueva ruta
router.post('/verify-code', verifyCode);
router.post('/change-password', changePassword);
export default router;

