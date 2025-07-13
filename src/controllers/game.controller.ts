import { Request, Response } from 'express';
import prisma from '../config/database';

export const gameController = {
  // Crear videojuego (CREATE)
  create: async (req: Request, res: Response) => {
    try {
      const {
        title,
        description,
        price,
        publisher,
        plataformaId,
        categoriaId,
        userId
      } = req.body;

      if (typeof title !== 'string' || typeof description !== 'string' || typeof publisher !== 'string' ||
          typeof price !== 'number' || typeof plataformaId !== 'number' || typeof categoriaId !== 'number' ||
          typeof userId !== 'number') {
        return res.status(400).json({ error: 'Datos de entrada inválidos.' });
      }

      const game = await prisma.game.create({
        data: {
          title,
          description,
          price,
          publisher,
          plataformaId,
          categoriaId,
          userId,
          estado: true,
          estaOferta: false
        }
      });

      res.status(201).json(game);
    } catch (error) {
      console.error('Error al crear juego:', error);
      res.status(500).json({ error: 'Error al crear el juego' });
    }
  },

  // Listar juegos (READ ALL)
  listGames: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        // Este 401 es correcto si la ruta requiere autenticación y no hay userId
        return res.status(401).json({ error: 'Usuario no autenticado o ID de usuario no disponible.' });
      }

      const games = await prisma.game.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          categoria: true,
          plataforma: true,
          user: { // ¡Mantenemos la inclusión del usuario!
            select: {
              id: true,
              name: true // ¡CAMBIO CLAVE AQUÍ! Usamos 'name' que sí existe en tu modelo User
            }
          }
        }
      });

      res.json(games);
    } catch (error) {
      console.error('Error al listar juegos:', error);
      res.status(500).json({ error: 'Error al listar juegos' });
    }
  },

  // Obtener un juego por ID (READ ONE)
  getGameById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const gameId = parseInt(id);

      if (isNaN(gameId)) {
        return res.status(400).json({ error: 'ID de juego inválido.' });
      }

      const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: {
          categoria: true,
          plataforma: true,
          user: { // También aseguramos que se seleccione 'name' aquí
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      if (!game) {
        return res.status(404).json({ error: 'Juego no encontrado.' });
      }

      res.json(game);
    } catch (error) {
      console.error('Error al obtener juego por ID:', error);
      res.status(500).json({ error: 'Error al obtener el juego.' });
    }
  },

  // Actualizar un juego existente (UPDATE)
  updateGame: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const gameId = parseInt(id);
      const {
        title,
        description,
        price,
        publisher,
        plataformaId,
        categoriaId,
        userId,
        estado,
        estaOferta
      } = req.body;

      if (isNaN(gameId)) {
        return res.status(400).json({ error: 'ID de juego inválido.' });
      }

      const updatedGame = await prisma.game.update({
        where: { id: gameId },
        data: {
          title,
          description,
          price,
          publisher,
          plataformaId,
          categoriaId,
          userId,
          estado,
          estaOferta
        },
      });

      res.json(updatedGame);
    } catch (error) {
      console.error('Error al actualizar juego:', error);
      if ((error as any).code === 'P2025') {
        return res.status(404).json({ error: 'Juego no encontrado para actualizar.' });
      }
      res.status(500).json({ error: 'Error al actualizar el juego.' });
    }
  },

  // Eliminar un juego (DELETE)
  deleteGame: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const gameId = parseInt(id);

      if (isNaN(gameId)) {
        return res.status(400).json({ error: 'ID de juego inválido.' });
      }

      await prisma.game.delete({
        where: { id: gameId },
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error al eliminar juego:', error);
      if ((error as any).code === 'P2025') {
        return res.status(404).json({ error: 'Juego no encontrado para eliminar.' });
      }
      res.status(500).json({ error: 'Error al eliminar el juego.' });
    }
  }
};