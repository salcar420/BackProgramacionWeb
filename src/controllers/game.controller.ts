import { Request, Response } from 'express';
import prisma from '../config/database';

export const gameController = {
  // Crear videojuego
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

      const game = await prisma.game.create({
        data: {
          title,
          description,
          price,
          publisher,
          plataformaId,
          categoriaId,
          userId,
          estado: true,       // campo requerido
          estaOferta: false   // campo requerido
        }
      });

      res.status(201).json(game);
    } catch (error) {
      console.error('Error al crear juego:', error);
      res.status(500).json({ error: 'Error al crear el juego' });
    }
  },

  // Listar juegos del usuario autenticado
  listGames: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;

      const games = await prisma.game.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      res.json(games);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al listar juegos' });
    }
  }
};
