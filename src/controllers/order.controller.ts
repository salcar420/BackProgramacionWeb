import { Request, Response } from 'express';

export const orderController = {
  createOrder: async (req: Request, res: Response) => {
    try {
      res.json({ message: 'Orden creada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear orden' });
    }
  },
};
