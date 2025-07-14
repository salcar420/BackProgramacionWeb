import { Request, Response } from 'express';
import prisma from '../config/database';

export const gameController = {
  create: async (req: Request, res: Response) => {
    try {
      const {
        title,
        description,
        price,
        publisher,
        plataformaId,
        categoriaId,
        userId,
        image,
        bannerImage
      } = req.body;

      if (!title || !description || !price || !publisher || !plataformaId || !categoriaId || !userId) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }

      const categoria = await prisma.categoria.findUnique({ where: { id: categoriaId } });
      const plataforma = await prisma.plataforma.findUnique({ where: { id: plataformaId } });

      if (!categoria || !plataforma) {
        return res.status(404).json({ error: 'Categoría o Plataforma no encontrada' });
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
          image,
          bannerImage,
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

  listGames: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(400).json({ error: 'Usuario no autenticado' });
      }

      const games = await prisma.game.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          categoria: true,
          plataforma: true,
        },
      });

      res.json(games);
    } catch (error) {
      console.error('Error al listar juegos:', error);
      res.status(500).json({ error: 'Error al listar juegos' });
    }
  },

  getAll: async (_req: Request, res: Response) => {
    try {
      const games = await prisma.game.findMany({
        include: {
          reviews: {
            include: {
              user: true,
            },
          },
          plataforma: true,
          categoria: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json(games);
    } catch (error) {
      console.error('Error al obtener todos los juegos:', error);
      res.status(500).json({ error: 'Error al obtener los juegos' });
    }
  },

  getGameById: async (req: Request, res: Response) => {
    const gameId = parseInt(req.params.id, 10);

    try {
      const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: {
          reviews: {
            include: {
              user: true,
            },
          },
          plataforma: true,
          categoria: true,
        },
      });

      if (!game) {
        return res.status(404).json({ message: 'Juego no encontrado' });
      }

      res.json(game);
    } catch (error) {
      console.error('Error al obtener el juego:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  updateGameVideoUrls: async (req: Request, res: Response) => {
    const gameId = parseInt(req.params.id, 10);
    const { videoUrls } = req.body;

    if (!Array.isArray(videoUrls)) {
      return res.status(400).json({ error: 'videoUrls debe ser un array' });
    }

    try {
      const updatedGame = await prisma.game.update({
        where: { id: gameId },
        data: { videoUrls },
      });

      return res.status(200).json(updatedGame);
    } catch (error) {
      console.error('Error al actualizar las URLs de video:', error);
      res.status(500).json({ error: 'Error al actualizar las URLs de video' });
    }
  }
};
