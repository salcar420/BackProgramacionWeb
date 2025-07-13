import { Request, Response } from 'express';
import prisma from '../config/database'; // Asumiendo que tu importación de prisma es correcta

export const userController = {
  getProfile: async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'No autorizado: ID de usuario no encontrado en el token.' });
    }
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, createdAt: true, estado: true } // Puedes incluir 'estado' si lo necesitas
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      res.json(user);
    } catch (error) {
      console.error('❌ Error al obtener perfil del usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener perfil.' });
    }
  },

  // Función para obtener el recuento total de usuarios
  getUsersCount: async (req: Request, res: Response) => {
    try {
      const userCount = await prisma.user.count(); // Esto cuenta todos los registros en la tabla User
      res.json({ totalUsers: userCount }); // Devuelve el conteo en un objeto { totalUsers: N }
    } catch (error) {
      console.error('❌ Error al obtener el recuento de usuarios:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener el recuento de usuarios.' });
    }
  },
};