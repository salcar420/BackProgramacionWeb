// src/controllers/game.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Exportamos un objeto 'gameController' que contiene todas las funciones de juegos
export const gameController = {
  // Función para obtener todos los juegos
  getAllGames: async (req: Request, res: Response) => {
    try {
      const games = await prisma.game.findMany({
        include: {
          user: true,      // Incluye la información del usuario que publicó el juego
          categoria: true, // Incluye la información de la categoría
          plataforma: true, // <--- ¡ASEGÚRATE QUE ESTÁ ASÍ!
          reviews: true,   // Incluye las reseñas
        },
      });
      res.status(200).json(games);
    } catch (error) {
      console.error('❌ Error al obtener juegos:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener los juegos.' });
    }
  },

  // Función para obtener un juego por ID
  getGameById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const game = await prisma.game.findUnique({
        where: { id: parseInt(id) },
        include: {
          user: true,
          categoria: true,
          plataforma: true,
          reviews: true,
        },
      });

      if (!game) {
        return res.status(404).json({ error: 'Juego no encontrado' });
      }
      res.status(200).json(game);
    } catch (error) {
      console.error('❌ Error al obtener juego por ID:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener el juego.' });
    }
  },

  // Función para crear un nuevo juego
  createGame: async (req: Request, res: Response) => {
    try {
      const { title, description, price, publisher, userId, categoriaId, plataformaId, estaOferta, estado } = req.body;

      if (!title || !description || !price || !publisher || !userId || !categoriaId || !plataformaId) {
        return res.status(400).json({ error: 'Todos los campos requeridos son obligatorios para crear un juego.' });
      }

      const newGame = await prisma.game.create({
        data: {
          title,
          description,
          price,
          publisher,
          userId,
          categoriaId,
          plataformaId,
          estaOferta: estaOferta !== undefined ? estaOferta : false,
          estado: estado !== undefined ? estado : true,
        },
      });
      res.status(201).json({ message: 'Juego creado exitosamente', game: newGame });
    } catch (error) {
      console.error('❌ Error al crear juego:', error);
      res.status(500).json({ error: 'Error interno del servidor al crear el juego.' });
    }
  },

  // Función para actualizar un juego existente
  updateGame: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, description, price, publisher, categoriaId, plataformaId, estaOferta, estado } = req.body;

      const updatedGame = await prisma.game.update({
        where: { id: parseInt(id) },
        data: {
          title,
          description,
          price,
          publisher,
          categoriaId,
          plataformaId,
          estaOferta,
          estado,
        },
      });
      res.status(200).json({ message: 'Juego actualizado exitosamente', game: updatedGame });
    } catch (error) {
      console.error('❌ Error al actualizar juego:', error);
      res.status(500).json({ error: 'Error interno del servidor al actualizar el juego.' });
    }
  },

  // Función para eliminar un juego
  deleteGame: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.game.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).send(); // 204 No Content para eliminación exitosa
    } catch (error) {
      console.error('❌ Error al eliminar juego:', error);
      res.status(500).json({ error: 'Error interno del servidor al eliminar el juego.' });
    }
  },
};