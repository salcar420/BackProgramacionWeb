// backend_project/src/routes/news.routes.ts

import { Router } from 'express';
import * as newsController from '../controllers/news.controller';
import { authenticate } from '../middlewares/auth.middleware'; // Tu middleware de autenticación existente
// import { authorizeAdmin } from '../middlewares/admin.middleware'; // <-- Esta línea ha sido comentada

const router = Router();

// Rutas públicas (cualquiera puede ver las noticias sin necesidad de autenticación)
router.get('/', newsController.getAllNews); // GET /api/news (para obtener todas las noticias)
router.get('/:id', newsController.getNewsById); // GET /api/news/:id (para obtener una noticia específica)

// Rutas protegidas (Ahora solo requieren que el usuario esté autenticado - logueado)
// Se ha quitado 'authorizeAdmin' de estas rutas.
router.post('/', authenticate, newsController.createNews); // POST /api/news
router.put('/:id', authenticate, newsController.updateNews); // PUT /api/news/:id
router.delete('/:id', authenticate, newsController.deleteNews); // DELETE /api/news/:id

export default router;