// src/routes/statistics.routes.ts
import { Router } from 'express';
import { statisticsController } from '../controllers/statistics.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware'; // Asegúrate de que estos middlewares estén correctos

const router = Router();

// Rutas protegidas por autenticación y autorización de admin
router.get('/monthly', authenticate, authorizeAdmin, statisticsController.getMonthlySales);
router.get('/yearly', authenticate, authorizeAdmin, statisticsController.getYearlySales);

export default router;