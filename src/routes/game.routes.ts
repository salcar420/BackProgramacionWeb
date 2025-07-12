import { Router } from 'express';
import { gameController } from '../controllers/game.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Ruta protegida para listar juegos del usuario autenticado
router.get('/', authenticate, gameController.listGames);

// Ruta protegida para crear un nuevo videojuego
router.post('/', authenticate, gameController.create);

export default router;
