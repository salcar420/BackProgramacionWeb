import { Router } from 'express';
import { reviewController } from '../controllers/review.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Crear reseña (requiere JWT)
router.post('/', authenticate, reviewController.create);

// Listar reseñas de un juego específico (público o autenticado)
router.get('/game/:gameId', reviewController.listByGame);

// Listar reseñas del usuario autenticado (requiere JWT)
router.get('/me', authenticate, reviewController.listMyReviews);

export default router;
