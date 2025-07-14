// src/controllers/plataforma.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const plataformaController = {
  getAllPlataformas: async (req: Request, res: Response) => {
    try {
      const plataformas = await prisma.plataforma.findMany();
      res.status(200).json(plataformas);
    } catch (error) {
      console.error('❌ Error al obtener plataformas:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener plataformas.' });
    }
  },
  // Puedes añadir más funciones si las necesitas, por ejemplo:
  /*
  getPlataformaById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const plataforma = await prisma.plataforma.findUnique({
        where: { id: parseInt(id) },
      });
      if (!plataforma) {
        return res.status(404).json({ error: 'Plataforma no encontrada' });
      }
      res.status(200).json(plataforma);
    } catch (error) {
      console.error('❌ Error al obtener plataforma por ID:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener la plataforma.' });
    }
  },
  */
};