import { Request, Response } from 'express';

export const adminController = {
  getDashboard: async (req: Request, res: Response) => {
    try {
      res.json({ message: 'Panel de administrador activo' });
    } catch (error) {
      res.status(500).json({ error: 'Error en panel administrador' });
    }
  },
};