import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todas las categorías
export const getAllCategorias = async (req: Request, res: Response) => {
  try {
    const categorias = await prisma.categoria.findMany();
    res.status(200).json(categorias);
  } catch (error: any) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener categorías.' });
  }
};

// Puedes añadir otras funciones CRUD si las necesitas (create, update, delete)