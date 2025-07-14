// src/controllers/categoria.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const categoriaController = {
  getAllCategorias: async (req: Request, res: Response) => {
    try {
      const categorias = await prisma.categoria.findMany();
      res.status(200).json(categorias);
    } catch (error) {
      console.error('❌ Error al obtener categorías:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener categorías.' });
    }
  },
  // Puedes añadir más funciones si las necesitas, por ejemplo:
  /*
  getCategoriaById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const categoria = await prisma.categoria.findUnique({
        where: { id: parseInt(id) },
      });
      if (!categoria) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      res.status(200).json(categoria);
    } catch (error) {
      console.error('❌ Error al obtener categoría por ID:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener la categoría.' });
    }
  },
  */
};