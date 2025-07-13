// src/routes/admin.routes.ts
import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Si tienes esta ruta para el dashboard, asegúrate que apunte a adminController.getDashboard
router.get('/dashboard', authenticate, adminController.getDashboard);

// ¡ESTA ES LA RUTA CRÍTICA QUE FALTA O ESTÁ MAL!
router.get('/sales/monthly', authenticate, adminController.getMonthlySales); // <--- ¡ASEGÚRATE DE QUE ESTA LÍNEA ESTÉ AHÍ!

export default router;