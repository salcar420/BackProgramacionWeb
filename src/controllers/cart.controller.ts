import { Request, Response } from 'express';

export const cartController = {
  getCart: async (req: Request, res: Response) => {
    try {
      res.json({ message: 'Obtener carrito' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener carrito' });
    }
  },
};