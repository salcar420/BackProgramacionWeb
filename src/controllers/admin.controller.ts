// src/controllers/admin.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Interfaz para el tipo de datos que esperamos de la consulta de orders.
// Esto es importante para que TypeScript entienda la estructura de cada objeto 'order'.
interface OrderData {
  createdAt: Date;
  total: number;
  // Si 'total' viene como un tipo 'Decimal' de Prisma (común con PostgreSQL double precision
  // o Numeric), entonces aquí sería 'total: Prisma.Decimal', y luego necesitarías
  // usar 'order.total.toNumber()' en la suma. Pero si ya lo mapea a 'number', está bien así.
}

export const adminController = {
  // Función para obtener datos generales del dashboard (la que agregaste en la Opción 1)
  getDashboard: async (req: Request, res: Response) => {
    console.log('--- Iniciando getDashboard ---');
    try {
      // Aquí podrías obtener el conteo de usuarios y las ventas mensuales
      // y devolverlos en un solo objeto si lo necesitaras para un dashboard general.
      // Por ahora, solo devuelve un mensaje de éxito.
      res.json({ message: 'Datos del dashboard de administración cargados correctamente.' });
      console.log('--- getDashboard finalizado con éxito ---');
    } catch (error) {
      console.error('❌ Error al obtener datos del dashboard:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener datos del dashboard.' });
    }
  },

  // Función para obtener las ventas mensuales (la que alimenta tu gráfico)
  getMonthlySales: async (req: Request, res: Response) => {
    console.log('--- Iniciando getMonthlySales ---');
    try {
      const yearParam = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();
      console.log(`Año solicitado para ventas: ${yearParam}`);

      // Inicializa un array para almacenar las ventas de cada mes.
      // El índice 0 es Enero, 11 es Diciembre.
      const monthlySales = Array(12).fill(0);

      // Consulta a la base de datos para obtener todas las órdenes del año especificado.
      // Asegúrate de que tu tabla Order en Prisma tiene 'createdAt' y 'total'.
      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: new Date(yearParam, 0, 1),    // Desde el 1 de enero del año
            lt: new Date(yearParam + 1, 0, 1), // Hasta el 31 de diciembre del año (justo antes del 1 de enero del siguiente)
          },
        },
        select: {
          createdAt: true, // Campo de fecha de la orden
          total: true,     // Campo del monto total de la orden
        },
      }) as OrderData[]; // Hacemos un type assertion para asegurar que TypeScript entienda la estructura.

      console.log('Órdenes obtenidas de la DB para getMonthlySales:', orders);

      // Si no se encuentran órdenes, loggeamos una advertencia.
      if (orders.length === 0) {
        console.warn('⚠️ No se encontraron órdenes para el año actual en la base de datos.');
      }

      // Itera sobre las órdenes y suma sus totales al mes correspondiente.
      orders.forEach(order => {
        const month = order.createdAt.getMonth(); // getMonth() devuelve 0 para Enero, 11 para Diciembre
        // Aseguramos que order.total sea un número para evitar errores.
        // Si 'order.total' es un objeto 'Decimal' de Prisma, necesitamos .toNumber().
        // Si es directamente un 'number', la primera parte de la expresión lo manejará.
        const orderTotal = (typeof order.total === 'number' ? order.total : (order.total as any)?.toNumber()) || 0;
        monthlySales[month] += orderTotal;
      });

      console.log('Ventas mensuales calculadas (raw):', monthlySales);

      // Formatea los datos en el formato que Recharts espera: [{ mes: "Enero", ventas: 1234.56 }]
      const formattedSales = monthlySales.map((sales, index) => ({
        mes: new Date(yearParam, index).toLocaleString('es-ES', { month: 'long' }), // Convierte el índice a nombre de mes (ej. "Enero")
        ventas: parseFloat(sales.toFixed(2)), // Redondea a 2 decimales y asegura que sea un número
      }));

      console.log('Datos formateados para el frontend (JSON):', formattedSales);
      res.json(formattedSales); // Envía los datos de ventas por mes al frontend
      console.log('--- getMonthlySales finalizado con éxito (respuesta JSON enviada) ---');

    } catch (error) {
      console.error('❌ ERROR CRÍTICO en getMonthlySales:', error);
      // Envía una respuesta JSON de error en caso de fallo, no HTML.
      res.status(500).json({ error: 'Error interno del servidor al obtener ventas mensuales.' });
      console.log('--- getMonthlySales finalizado con ERROR ---');
    }
  },
};