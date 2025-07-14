// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extiende la interfaz Request de Express para añadir la propiedad 'user'
declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: number; email: string; role: string; }; // <--- ¡ASEGÚRATE DE QUE 'role: string;' ESTÉ AQUÍ!
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Usar una clave por defecto en desarrollo

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.warn('⚠️ Intento de acceso a ruta protegida sin token de autorización.');
    return res.status(401).json({ error: 'No se proporcionó token de autenticación.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.warn('⚠️ Token de autorización mal formado (no "Bearer ").');
    return res.status(401).json({ error: 'Formato de token inválido. Se espera "Bearer [token]".' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string; }; // Asegúrate de que 'role' se decodifica
    req.user = decoded;
    next();

  } catch (error: any) {
    console.error('❌ Error de verificación de JWT:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token de autenticación expirado. Por favor, inicia sesión de nuevo.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token de autenticación inválido. Por favor, inicia sesión de nuevo.' });
    }
    res.status(500).json({ error: 'Error interno de autenticación.' });
  }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    console.warn('⚠️ authorizeAdmin: req.user no encontrado. El middleware authenticate no se ejecutó o falló.');
    return res.status(401).json({ error: 'No autorizado. Se requiere autenticación.' });
  }

  if (req.user.role !== 'admin') { // <--- ¡CLAVE: Comprueba que el rol sea 'admin'!
    console.warn(`⚠️ Acceso denegado: Usuario ${req.user.email || req.user.id} intentó acceder a ruta de admin sin privilegios.`);
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
  }

  next();
};
