import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../utils/mailer';
import crypto from 'crypto';
import { token } from 'morgan';

const prisma = new PrismaClient();



export const register = async (req: Request, res: Response) => {
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

    // 🔐 Genera token de verificación
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        estado: false,
        code: verificationCode,
        token: verificationToken,
      }
    });

    // 📧 Envía el correo
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: 'Registro exitoso. Revisa tu correo para verificar tu cuenta.' });
  } catch (error) {
    console.error('❌ Error en el registro:', error);
    res.status(500).json({ error: 'Error en el registro' });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (!user.estado) {
      return res.status(403).json({ message: 'Cuenta no verificada. Revisa tu correo electrónico.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    // 💡 OPCIONAL: Si no quieres guardar el token, simplemente comenta esta parte
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: { token }, // solo si quieres guardar el token
    // });

    res.status(200).json({ message: 'Login exitoso', token });
  } catch (error) {
    console.error('❌ Error en el login:', error);
    res.status(500).json({ message: 'Error en el login' });
  }
};


export const verifyCode = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.code !== code) {
      return res.status(400).json({ error: 'Código inválido o usuario no encontrado' });
    }

    await prisma.user.update({
      where: { email },
      data: {
        estado: true,
        code: null
      }
    });

    res.json({ message: '✅ Verificación exitosa. Ahora puedes iniciar sesión.' });
  } catch (error) {
    console.error('❌ Error al verificar código:', error);
    res.status(500).json({ error: 'Error al verificar código' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    const user = await prisma.user.findFirst({ where: { token: String(token) } });
    if (!user) {
      return res.status(400).json({ error: 'Token inválido o ya verificado' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        estado: true,
        token: null, // elimina el token
      },
    });

    res.send('✅ Cuenta verificada exitosamente. Ahora puedes iniciar sesión.');
  } catch (error) {
    console.error('❌ Error en la verificación:', error);
    res.status(500).json({ error: 'Error en la verificación' });
  }
};


export const changePassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('❌ Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error al cambiar la contraseña' });
  }
};
