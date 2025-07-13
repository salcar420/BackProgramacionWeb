import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/profile', authenticate, userController.getProfile);

// --- ¡NUEVA RUTA PARA OBTENER EL RECUENTO DE USUARIOS! ---
// Esta ruta llamará a la nueva función `getUsersCount` en tu user.controller.
// Es importante protegerla con el middleware `authenticate` si solo los usuarios logueados (administradores) deben acceder a esta información.
router.get('/count', authenticate, userController.getUsersCount); // <--- ¡AÑADE ESTA LÍNEA!

export default router;