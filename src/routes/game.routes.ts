import { Router } from 'express';
// ¡CAMBIO CLAVE AQUÍ! Importa el objeto gameController completo
import { gameController } from '../controllers/game.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Ruta protegida para listar juegos (READ ALL)
router.get('/', authenticate, gameController.listGames); // Accede a la función a través del objeto

// Ruta protegida para crear un nuevo videojuego (CREATE)
router.post('/', authenticate, gameController.create); // Accede a la función a través del objeto

// Rutas para obtener, actualizar y eliminar
// Ruta protegida para OBTENER un juego por ID (READ ONE)
router.get('/:id', authenticate, gameController.getGameById); // Accede a la función a través del objeto

// Ruta protegida para ACTUALIZAR un juego existente (UPDATE)
router.put('/:id', authenticate, gameController.updateGame); // Accede a la función a través del objeto

// Ruta protegida para ELIMINAR un juego (DELETE)
router.delete('/:id', authenticate, gameController.deleteGame); // Accede a la función a través del objeto

export default router;