import { Router } from 'express';
// Importamos el objeto authController completo
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware'; // Importa tu middleware de autenticación

const router = Router();

// Usamos los métodos del objeto authController
router.post('/register', authController.register);
router.post('/login', authController.login);

// Ruta para obtener el perfil del usuario autenticado, protegida por el middleware
router.get('/profile', authenticate, authController.getProfile);

export default router;