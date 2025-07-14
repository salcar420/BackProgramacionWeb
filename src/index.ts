import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import newsRoutes from './routes/news.routes';
import gameRoutes from './routes/game.routes';
import categoriaRoutes from './routes/categoria.routes';
import plataformaRoutes from './routes/plataforma.routes';
import statisticsRoutes from './routes/statistics.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/plataformas', plataformaRoutes);
app.use('/api/admin/sales', statisticsRoutes);

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
