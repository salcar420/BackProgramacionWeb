// routes/game.routes.ts

import { Router } from 'express';
import { gameController } from '../controllers/game.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', gameController.getAll);
router.get('/user', authenticate, gameController.listGames);
router.get('/:id', gameController.getGameById);  // Agrega esta ruta para obtener el juego por ID
router.post('/', authenticate, gameController.create);
router.put('/games/:id/videoUrls', gameController.updateGameVideoUrls);

export default router;
