// backend_project/src/routes/game.routes.ts

import { Router } from 'express';
import { gameController } from '../controllers/game.controller'; // Correcto: importa el objeto gameController
import { authenticate } from '../middlewares/auth.middleware'; // Correcto: importa el middleware

const router = Router();

router.get('/', gameController.getAllGames);
router.get('/:id', authenticate, gameController.getGameById);
router.post('/', authenticate, gameController.createGame);
router.put('/:id', authenticate, gameController.updateGame);
router.delete('/:id', authenticate, gameController.deleteGame);

export default router;