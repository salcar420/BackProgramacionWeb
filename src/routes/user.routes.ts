        // src/routes/user.routes.ts
        import { Router } from 'express';
        import { userController } from '../controllers/user.controller';
        import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware'; // Necesitas tus middlewares de auth

        const router = Router();

        // Ruta para obtener todos los usuarios (protegida para administradores)
        router.get('/', authenticate, authorizeAdmin, userController.getAllUsers);

        // Ruta para obtener el conteo total de usuarios (protegida para administradores)
        router.get('/count', authenticate, authorizeAdmin, userController.getUsersCount); // Usa getUsersCount para coincidir con tu frontend

        // Ruta para obtener un usuario por ID (opcional, si la necesitas)
        router.get('/:id', authenticate, authorizeAdmin, userController.getUserById);

        // Puedes añadir rutas para crear, actualizar o eliminar usuarios aquí

        export default router;
    