import { Router } from 'express';
import * as plataformaController from '../controllers/plataforma.controller';
import { authenticate } from '../middlewares/auth.middleware'; // Importa el middleware de autenticación

const router = Router();

// Ruta protegida para obtener todas las plataformas
router.get('/', authenticate, plataformaController.getAllPlataformas);

export default router;