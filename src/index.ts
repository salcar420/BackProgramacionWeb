// backend_project/index.ts

import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

// --- Importa tus archivos de rutas ---
// ¡Asegúrate de que estas rutas existen en backend_project/src/routes/ y los nombres son exactos!
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes'; // Asumiendo que tienes un admin.routes.ts
import newsRoutes from './routes/news.routes';
import gameRoutes from './routes/game.routes';
import categoriaRoutes from './routes/categoria.routes';
import plataformaRoutes from './routes/plataforma.routes';
import statisticsRoutes from './routes/statistics.routes'; // <--- ¡NUEVA LÍNEA: IMPORTACIÓN DE ESTADÍSTICAS!

// Carga las variables de entorno desde el archivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Define el puerto del servidor

// --- Middlewares Globales (se ejecutan para cada solicitud) ---
// Estos deben ir ANTES de la definición de tus rutas
app.use(cors()); // Habilita CORS para permitir solicitudes desde tu frontend (Vite)
app.use(morgan('dev')); // Logger de solicitudes HTTP para verlas en la consola (útil para depuración)
app.use(express.json()); // Permite a Express parsear cuerpos de solicitud en formato JSON
app.use(express.urlencoded({ extended: true })); // Para parsear datos de formularios URL-encoded

// --- Definición de Rutas de la API ---
// Asocia los objetos Router importados con un prefijo de URL
// ¡Asegúrate que estas líneas NO ESTÁN COMENTADAS!
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes); // Si no tienes este archivo, coméntalo o elimínalo
app.use('/api/news', newsRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/categorias', categoriaRoutes);   // Ruta en español para Categorías
app.use('/api/plataformas', plataformaRoutes); // Ruta en español para Plataformas
app.use('/api/admin/sales', statisticsRoutes); // <--- ¡NUEVA LÍNEA: MONTAJE DE RUTAS DE ESTADÍSTICAS!

// --- Ruta de prueba básica para verificar que el servidor está funcionando ---
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API de Backend funcionando correctamente!' });
});

// --- Manejadores de Errores (¡CRÍTICO: Deben ir al FINAL de todas tus rutas app.use()!) ---

// 1. Manejador de rutas no encontradas (404 Not Found)
// Se activa si ninguna de las rutas definidas anteriormente coincide con la solicitud.
app.use((req: Request, res: Response, next: NextFunction) => {
  // Siempre devuelve JSON para errores, no HTML
  res.status(404).json({ error: 'Ruta de API no encontrada. Verifica la URL y el método HTTP.' });
});

// 2. Manejador de errores global (500 Internal Server Error)
// Captura cualquier error que ocurra en los controladores o middlewares anteriores.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Loguea el stack trace completo del error en la consola del servidor para depuración
  console.error('❌ ERROR GLOBAL DEL SERVIDOR:', err.stack);
  res.status(500).json({
    error: err.message || 'Ocurrió un error interno desconocido en el servidor. Por favor, revisa los logs del servidor para más detalles.'
  });
});

// --- Inicia el servidor ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});