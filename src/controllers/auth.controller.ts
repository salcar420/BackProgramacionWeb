// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

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
          role: 'user', // Asigna un rol por defecto 'user' al registrar
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

      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET no está definido en las variables de entorno.');
        return res.status(500).json({ error: 'Configuración del servidor incompleta.' });
      }

      // CAMBIO CLAVE: Incluye 'role' en el payload del token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role }, // <--- ¡Asegúrate de que 'role: user.role' esté aquí!
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      await prisma.user.update({
        where: { id: user.id },
        data: { token }
      });

      // Devuelve el rol del usuario al frontend en la respuesta del login
      res.status(200).json({ message: 'Login exitoso', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      console.error('❌ Error en el login:', error);
      res.status(500).json({ error: 'Error en el login' });
    }
  },

  getProfile: async (req: Request, res: Response) => {
    try {
      // El middleware 'authenticate' adjunta req.user con { id, email, role }
      const userIdFromToken = req.user?.id;

      if (!userIdFromToken) {
        console.warn('⚠️ getProfile: ID de usuario no encontrado en req.user. Esto puede indicar un problema con el middleware de autenticación o un token inválido.');
        return res.status(401).json({ error: 'No autorizado: ID de usuario no encontrado en el token.' });
      }

      console.log('Intentando obtener perfil para userId:', userIdFromToken); // Log para depuración

      const user = await prisma.user.findUnique({
        where: { id: userIdFromToken },
        select: {
          id: true,
          name: true,
          email: true,
          estado: true, // Descomentado: Asumiendo que 'estado' ya existe y es booleano
          role: true,   // Descomentado: Asumiendo que 'role' ya existe y es string
        },
      });

      if (!user) {
        console.warn(`⚠️ getProfile: Usuario con ID ${userIdFromToken} no encontrado en la base de datos.`);
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      res.json(user);
    } catch (error: any) {
      console.error('❌ Error al obtener perfil del usuario:', error.message, error.stack);
      res.status(500).json({ error: 'Error interno del servidor al obtener perfil.' });
    }
  },
};
