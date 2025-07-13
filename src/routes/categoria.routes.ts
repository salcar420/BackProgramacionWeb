import { Router } from 'express';
import * as categoriaController from '../controllers/categoria.controller';
import { authenticate } from '../middlewares/auth.middleware'; // Importa el middleware de autenticación

const router = Router();

// Ruta protegida para obtener todas las categorías
router.get('/', authenticate, categoriaController.getAllCategorias);

export default router;