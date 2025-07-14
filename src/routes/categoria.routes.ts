// backend_project/src/routes/categoria.routes.ts

import { Router } from 'express';
// CAMBIO CLAVE AQUÍ: Importa el objeto 'categoriaController' directamente
import { categoriaController } from '../controllers/categoria.controller'; 
import { authenticate } from '../middlewares/auth.middleware'; // Asumo que necesitas autenticación para estas rutas

const router = Router();

// Ruta para obtener todas las categorías
router.get('/', authenticate, categoriaController.getAllCategorias);

// Si necesitas rutas para crear, actualizar o eliminar categorías, agrégalas aquí, usando el objeto controller
// router.post('/', authenticate, categoriaController.createCategoria);
// router.put('/:id', authenticate, categoriaController.updateCategoria);
// router.delete('/:id', authenticate, categoriaController.deleteCategoria);

export default router;