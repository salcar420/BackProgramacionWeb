// backend_project/src/routes/plataforma.routes.ts

import { Router } from 'express';
// CAMBIO CLAVE AQUÍ: Importa el objeto 'plataformaController' directamente
import { plataformaController } from '../controllers/plataforma.controller'; 
import { authenticate } from '../middlewares/auth.middleware'; // Asumo que necesitas autenticación para estas rutas

const router = Router();

// Ruta para obtener todas las plataformas
router.get('/', authenticate, plataformaController.getAllPlataformas);

// Si necesitas rutas para crear, actualizar o eliminar plataformas, agrégalas aquí, usando el objeto controller
// router.post('/', authenticate, plataformaController.createPlataforma);
// router.put('/:id', authenticate, plataformaController.updatePlataforma);
// router.delete('/:id', authenticate, plataformaController.deletePlataforma);

export default router;