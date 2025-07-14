// src/index.ts
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path = require('path');

import authRoutes from './routes/auth.routes';
import cartRoutes from './routes/cart.routes';
import gameRoutes from './routes/game.routes';
// importa otras rutas que tengas

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/Imagenes', express.static(path.join(__dirname, '../Imagenes')));

app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/games', gameRoutes);
// usa otras rutas

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API de Backend funcionando correctamente!' });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: 'Ruta de API no encontrada. Verifica la URL y el método HTTP.' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ ERROR GLOBAL DEL SERVIDOR:', err.stack);
  res.status(500).json({
    error: err.message || 'Ocurrió un error interno desconocido en el servidor. Por favor, revisa los logs del servidor para más detalles.'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
