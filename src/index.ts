import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Importación de rutas
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import gameRoutes from './routes/game.routes';
import newsRoutes from './routes/news.routes';
import reviewRoutes from './routes/review.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import adminRoutes from './routes/admin.routes';
import categoriaRoutes from './routes/categoria.routes';
import plataformaRoutes from './routes/plataforma.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // Usamos las rutas de usuario
app.use('/api/games', gameRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categorias', categoriaRoutes); // Ruta para categorías
app.use('/api/plataformas', plataformaRoutes); // Ruta para plataformas

// Ruta base
app.get('/', (_req, res) => {
    res.status(200).send('API funcionando correctamente');
});

// Inicialización del servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});