// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extiende la interfaz Request de Express para añadir la propiedad 'user'
declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: number; email: string; role: string; };
  }
}

export const userController = {
  // Función para obtener el perfil del usuario autenticado
  getProfile: async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      console.warn('⚠️ getProfile: ID de usuario no encontrado en req.user.');
      return res.status(401).json({ error: 'No autorizado: ID de usuario no encontrado en el token.' });
    }
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          estado: true,
          role: true,
        }
      });

      if (!user) {
        console.warn(`⚠️ getProfile: Usuario con ID ${userId} no encontrado en la base de datos.`);
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      res.json(user);
    } catch (error: any) {
      console.error('❌ Error al obtener perfil del usuario:', error.message, error.stack);
      res.status(500).json({ error: 'Error interno del servidor al obtener perfil.' });
    }
  },

  // Función para obtener todos los usuarios
  getAllUsers: async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          estado: true,
          role: true,
          createdAt: true,
        },
      });
      res.status(200).json(users);
    } catch (error: any) {
      console.error('❌ Error al obtener todos los usuarios:', error.message, error.stack);
      res.status(500).json({ error: 'Error interno del servidor al obtener los usuarios.' });
    }
  },

  // NUEVA FUNCIÓN: Función para obtener un usuario por ID
  getUserById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          name: true,
          email: true,
          estado: true,
          role: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.status(200).json(user);
    } catch (error: any) {
      console.error('❌ Error al obtener usuario por ID:', error.message, error.stack);
      res.status(500).json({ error: 'Error interno del servidor al obtener el usuario.' });
    }
  },

  // Función para obtener el conteo total de usuarios
  getUsersCount: async (req: Request, res: Response) => {
    try {
      const userCount = await prisma.user.count();
      res.status(200).json({ totalUsers: userCount });
    } catch (error: any) {
      console.error('❌ Error al obtener el recuento de usuarios:', error.message, error.stack);
      res.status(500).json({ error: 'Error interno del servidor al obtener el conteo de usuarios.' });
    }
  },
};