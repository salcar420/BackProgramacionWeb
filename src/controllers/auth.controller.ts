import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../utils/mailer'; // Importamos el mailer

const prisma = new PrismaClient();

export const authController = {
  // Registro del usuario
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

      // Genera un código de verificación aleatorio
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos

      // Crea el nuevo usuario en la base de datos, guardando el código de verificación
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          estado: false,  // Estado 'false' hasta que el usuario verifique el código
          role: 'user',
          verificationCode,  // Guarda el código de verificación
        }
      });

      // Enviar correo de verificación
      await sendVerificationEmail(email, verificationCode);

      res.status(201).json({ message: 'Usuario registrado exitosamente. Revisa tu correo para el código de verificación.' });
    } catch (error) {
      console.error('❌ Error en el registro:', error);
      res.status(500).json({ error: 'Error en el registro' });
    }
  },

  // Verificación del correo
  verifyEmail: async (req: Request, res: Response) => {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({ error: 'Falta el token de verificación' });
      }

      // Verificar el token (este es el que recibimos en el enlace)
      const decoded = jwt.verify(token as string, process.env.JWT_SECRET!) as jwt.JwtPayload;

      // Si el token es válido, marcamos el usuario como verificado
      const user = await prisma.user.update({
        where: { email: decoded.email },  // Asegurándonos de acceder a decoded.email
        data: { estado: true },
      });

      res.status(200).json({ message: 'Cuenta verificada con éxito. Ahora puedes iniciar sesión.' });
    } catch (error) {
      console.error('❌ Error al verificar el correo:', error);
      res.status(500).json({ error: 'Error al verificar el correo' });
    }
  },

  // Verificación del código
  verifyCode: async (req: Request, res: Response) => {
    try {
      const { email, code } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      if (user.verificationCode !== code) {
        return res.status(400).json({ error: 'Código incorrecto' });
      }

      // Si el código es correcto, cambiamos el estado del usuario a 'true' (verificado)
      await prisma.user.update({
        where: { email },
        data: { estado: true },
      });

      res.status(200).json({ message: 'Verificación exitosa. Ahora puedes iniciar sesión.' });
    } catch (error) {
      console.error('❌ Error al verificar el código:', error);
      res.status(500).json({ error: 'Error al verificar el código' });
    }
  },

  // Inicio de sesión del usuario
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

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role }, 
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      await prisma.user.update({
        where: { id: user.id },
        data: { token }
      });

      res.status(200).json({ message: 'Login exitoso', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      console.error('❌ Error en el login:', error);
      res.status(500).json({ error: 'Error en el login' });
    }
  },

  // Obtener perfil del usuario
  getProfile: async (req: Request, res: Response) => {
    try {
      const userIdFromToken = req.user?.id;

      if (!userIdFromToken) {
        return res.status(401).json({ error: 'No autorizado: ID de usuario no encontrado en el token.' });
      }

      const user = await prisma.user.findUnique({
        where: { id: userIdFromToken },
        select: {
          id: true,
          name: true,
          email: true,
          estado: true, 
          role: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      res.json(user);
    } catch (error) {
      console.error('❌ Error al obtener perfil del usuario:', error);
      res.status(500).json({ error: 'Error al obtener perfil' });
    }
  },
};
