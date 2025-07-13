import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todas las plataformas
export const getAllPlataformas = async (req: Request, res: Response) => {
  try {
    const plataformas = await prisma.plataforma.findMany();
    res.status(200).json(plataformas);
  } catch (error: any) {
    console.error('Error al obtener plataformas:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener plataformas.' });
  }
};

// Puedes añadir otras funciones CRUD si las necesitas (create, update, delete)