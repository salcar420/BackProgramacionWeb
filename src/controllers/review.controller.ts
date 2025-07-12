import { Request, Response } from 'express';
import prisma from '../config/database';

export const reviewController = {
  // Crear reseña (requiere JWT)
  create: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { gameId, content, stars } = req.body;

      const review = await prisma.review.create({
        data: {
          content,
          stars,
          userId,
          gameId,
        },
      });

      res.status(201).json(review);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear reseña' });
    }
  },

  // Listar reseñas de un juego específico (público o autenticado)
  listByGame: async (req: Request, res: Response) => {
    try {
      const gameId = parseInt(req.params.gameId);

      const reviews = await prisma.review.findMany({
        where: { gameId },
        include: {
          user: {
            select: { name: true },
          },
        },
      });

      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al listar reseñas del juego' });
    }
  },

  // Listar reseñas del usuario autenticado (requiere JWT)
  listMyReviews: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;

      const reviews = await prisma.review.findMany({
        where: { userId },
        include: {
          game: {
            select: { title: true },
          },
        },
      });

      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al listar tus reseñas' });
    }
  },
};
