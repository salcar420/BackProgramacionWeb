// backend_project/src/controllers/news.controller.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todas las noticias (GET /api/news)
export const getAllNews = async (req: Request, res: Response) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: {
        createdAt: 'desc', // Ordena las noticias por fecha de creación, las más nuevas primero
      },
      // select: { // Si usaras un select específico y excluyeras 'activo', aquí iría, pero al eliminarlo del schema, no es necesario
      //   id: true,
      //   title: true,
      //   content: true,
      //   imageUrl: true,
      //   createdAt: true,
      //   updatedAt: true,
      // }
    });
    res.json(news);
  } catch (error: any) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: error.message || 'Error al obtener noticias.' });
  }
};

// Obtener una noticia por ID (GET /api/news/:id)
export const getNewsById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const newsItem = await prisma.news.findUnique({
      where: { id: parseInt(id) },
    });
    if (newsItem) {
      res.json(newsItem);
    } else {
      res.status(404).json({ error: 'Noticia no encontrada.' });
    }
  } catch (error: any) {
    console.error("Error fetching news by ID:", error);
    res.status(500).json({ error: error.message || 'Error al obtener la noticia.' });
  }
};

// Crear una nueva noticia (POST /api/news)
export const createNews = async (req: Request, res: Response) => {
  // Desestructuramos solo los campos que esperamos recibir. 'activo' ya no debería venir.
  const { title, content, imageUrl } = req.body;

  // Validación básica (puedes expandirla)
  if (!title || !content) {
    return res.status(400).json({ error: 'Título y contenido son campos requeridos.' });
  }

  try {
    const newNews = await prisma.news.create({
      data: {
        title,
        content,
        imageUrl: imageUrl || null, // Guarda null si no se proporciona imageUrl
        // 'activo' ya no se especifica aquí, porque no existe en el modelo
      },
    });
    res.status(201).json(newNews);
  } catch (error: any) {
    console.error("Error creating news:", error);
    res.status(500).json({ error: error.message || 'Error al crear la noticia.' });
  }
};

// Actualizar una noticia existente (PUT /api/news/:id)
export const updateNews = async (req: Request, res: Response) => {
  const { id } = req.params;
  // Desestructuramos solo los campos que esperamos recibir. 'activo' ya no debería venir.
  const { title, content, imageUrl } = req.body;

  // Objeto para los datos a actualizar
  const updateData: {
    title?: string;
    content?: string;
    imageUrl?: string | null;
    // activo?: boolean; // Esta línea ya no es necesaria
  } = {};

  if (title !== undefined) updateData.title = title;
  if (content !== undefined) updateData.content = content;
  // Manejamos imageUrl: si es cadena vacía, guardamos null; de lo contrario, el valor.
  if (imageUrl !== undefined) updateData.imageUrl = imageUrl === '' ? null : imageUrl;
  // if (activo !== undefined) updateData.activo = activo; // Esta línea ya no es necesaria

  // Si no hay datos para actualizar, aunque improbable con los campos requeridos, es una buena práctica.
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'No se proporcionaron datos para actualizar.' });
  }

  try {
    const updatedNews = await prisma.news.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    res.json(updatedNews);
  } catch (error: any) {
    console.error("Error updating news:", error);
    if (error.code === 'P2025') { // Prisma Client error: Record not found
      return res.status(404).json({ error: 'Noticia no encontrada para actualizar.' });
    }
    res.status(500).json({ error: error.message || 'Error al actualizar la noticia.' });
  }
};

// Eliminar una noticia (DELETE /api/news/:id)
export const deleteNews = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.news.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // No Content
  } catch (error: any) {
    console.error("Error deleting news:", error);
    if (error.code === 'P2025') { // Prisma Client error: Record not found
      return res.status(404).json({ error: 'Noticia no encontrada para eliminar.' });
    }
    res.status(500).json({ error: error.message || 'Error al eliminar la noticia.' });
  }
};  