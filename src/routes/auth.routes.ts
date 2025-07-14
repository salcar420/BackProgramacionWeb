import { Router } from 'express';
import { authController } from '../controllers/auth.controller'; // Importación del controlador completo

const router = Router();

// Rutas de autenticación
router.post('/register', authController.register);
router.post('/login', authController.login);

// Ruta para la verificación del correo electrónico
router.get('/verify', authController.verifyEmail);  // Ruta para verificar el correo electrónico

// Ruta para verificar el código
router.post('/verify-code', authController.verifyCode);

// Obtener perfil del usuario (protegida)
router.get('/profile', authController.getProfile);
router.post('/change-password', authController.changePassword);

export default router;
