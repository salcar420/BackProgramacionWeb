import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Exportamos un objeto 'authController' que contiene todas las funciones de autenticación
export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'El usuario ya existe' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          estado: true,
          token: '', // Podrías considerar no guardar el token aquí, o manejarlo de otra forma si solo es para sesión.
        }
      });

      res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
    } catch (error) {
      console.error('❌ Error en el registro:', error);
      res.status(500).json({ error: 'Error en el registro' });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

      // Asegúrate de que JWT_SECRET esté definido en tus variables de entorno
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET no está definido en las variables de entorno.');
        return res.status(500).json({ error: 'Configuración del servidor incompleta.' });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { token } // Guarda el token en la DB, aunque muchos prefieren solo devolverlo.
      });

      res.status(200).json({ message: 'Login exitoso', token });
    } catch (error) {
      console.error('❌ Error en el login:', error);
      res.status(500).json({ error: 'Error en el login' });
    }
  },

  // Función para obtener el perfil del usuario autenticado
  getProfile: async (req: Request, res: Response) => {
    try {
      // El middleware 'authenticate' debería adjuntar el ID del usuario al objeto 'req'
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'No autorizado: ID de usuario no encontrado en el token.' });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          estado: true,
          // NO incluyas 'password' ni 'token' por seguridad aquí
        },
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
};