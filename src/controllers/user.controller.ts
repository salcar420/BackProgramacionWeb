import { Request, Response } from 'express';
import prisma from '../config/database';

export const userController = {
  getProfile: async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, createdAt: true }
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener perfil' });
    }
  },
};
