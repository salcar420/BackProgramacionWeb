// src/controllers/cart.controller.ts
import { Request, Response } from 'express';
import prisma from '../config/database';

export const cartController = {
  addToCart: async (req: Request & { user?: any }, res: Response) => {
    try {
      const userId = req.user?.id;
      const { gameId } = req.body;

      if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });

      const existingItem = await prisma.cartItem.findFirst({ where: { userId, gameId } });
      if (existingItem) return res.status(400).json({ message: 'Este juego ya está en tu carrito.' });

      const newItem = await prisma.cartItem.create({ data: { userId, gameId } });

      res.status(201).json(newItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al agregar al carrito' });
    }
  },

  getCart: async (req: Request & { user?: any }, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });

      const items = await prisma.cartItem.findMany({
        where: { userId },
        include: { game: true },
      });

      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener el carrito' });
    }
  },

  removeFromCart: async (req: Request & { user?: any }, res: Response) => {
    try {
      const userId = req.user?.id;
      const gameId = Number(req.params.gameId);
      if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });

      const deletedItem = await prisma.cartItem.deleteMany({ where: { userId, gameId } });

      if (deletedItem.count === 0) return res.status(404).json({ message: 'Juego no encontrado en el carrito' });

      res.json({ message: 'Juego eliminado del carrito' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar del carrito' });
    }
  },
};
