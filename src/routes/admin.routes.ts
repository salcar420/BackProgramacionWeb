// src/routes/admin.routes.ts

import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware'; // Correcto
import { gameController } from '../controllers/game.controller';
import { categoriaController } from '../controllers/categoria.controller';
import { plataformaController } from '../controllers/plataforma.controller';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authenticate, authController.getProfile); // Correcto

router.get('/games', authenticate, gameController.getAllGames); // Esto funcionará
router.post('/games', authenticate, gameController.createGame); // Esto funcionará

router.get('/categorias', authenticate, categoriaController.getAllCategorias); // Esto funcionará
router.get('/plataformas', authenticate, plataformaController.getAllPlataformas); // Esto funcionará

export default router;