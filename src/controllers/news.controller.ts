import { Request, Response } from 'express';

export const newsController = {
  listNews: async (req: Request, res: Response) => {
    try {
      res.json({ message: 'Listado de noticias' });
    } catch (error) {
      res.status(500).json({ error: 'Error al listar noticias' });
    }
  },
};
