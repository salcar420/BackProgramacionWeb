// src/controllers/statistics.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Interfaz para el tipo de datos que esperas de la consulta de órdenes de Prisma
interface OrderData {
  createdAt: Date; // Prisma devuelve Date por defecto para DateTime
  total: number;
}

export const statisticsController = {
  getMonthlySales: async (req: Request, res: Response) => {
    try {
      const currentYear = new Date().getFullYear();

      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
          },
        },
        select: {
          createdAt: true,
          total: true,
        },
      });

      const monthlySalesMap = new Map<string, number>();
      const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];

      monthNames.forEach(month => monthlySalesMap.set(month, 0));

      // CAMBIO CLAVE: Especificar el tipo de 'order' como OrderData
      orders.forEach((order: OrderData) => { // <--- ¡AQUÍ ESTÁ LA CORRECCIÓN!
        if (order.createdAt && typeof order.total === 'number') {
          try {
            const date = new Date(order.createdAt);
            if (isNaN(date.getTime())) {
              console.warn(`⚠️ Fecha inválida encontrada en orden ${order.createdAt}. Saltando esta orden.`);
              return;
            }
            const monthIndex = date.getMonth();
            const monthName = monthNames[monthIndex];
            const currentTotal = monthlySalesMap.get(monthName) || 0;
            monthlySalesMap.set(monthName, currentTotal + order.total);
          } catch (dateError) {
            console.error(`❌ Error al procesar fecha de orden ${order.createdAt}:`, dateError);
          }
        } else {
          console.warn(`⚠️ Orden con datos incompletos o inválidos (createdAt: ${order.createdAt}, total: ${order.total}). Saltando esta orden.`);
        }
      });

      const realMonthlySalesData = monthNames.map(month => ({
        month: month,
        sales: monthlySalesMap.get(month) || 0,
      }));

      res.status(200).json(realMonthlySalesData);
    } catch (error: any) {
      console.error('❌ Error al obtener ventas mensuales:', error.message, error.stack);
      res.status(500).json({ error: 'Error interno del servidor al obtener ventas mensuales.' });
    }
  },

  getYearlySales: async (req: Request, res: Response) => {
    try {
      const orders = await prisma.order.findMany({
        select: {
          createdAt: true,
          total: true,
        },
      });

      const yearlySalesMap = new Map<number, number>();
      const yearsInOrders = new Set<number>();

      // CAMBIO CLAVE: Especificar el tipo de 'order' como OrderData
      orders.forEach((order: OrderData) => { // <--- ¡AQUÍ ESTÁ LA CORRECCIÓN!
        if (order.createdAt && typeof order.total === 'number') {
          try {
            const date = new Date(order.createdAt);
            if (isNaN(date.getTime())) {
              console.warn(`⚠️ Fecha inválida encontrada en orden ${order.createdAt}. Saltando esta orden.`);
              return;
            }
            const year = date.getFullYear();
            yearsInOrders.add(year);
            const currentTotal = yearlySalesMap.get(year) || 0;
            yearlySalesMap.set(year, currentTotal + order.total);
          } catch (dateError) {
            console.error(`❌ Error al procesar fecha de orden ${order.createdAt}:`, dateError);
          }
        } else {
          console.warn(`⚠️ Orden con datos incompletos o inválidos (createdAt: ${order.createdAt}, total: ${order.total}). Saltando esta orden.`);
        }
      });

      const sortedYears = Array.from(yearsInOrders).sort((a, b) => a - b);

      const realYearlySalesData = sortedYears.map(year => ({
        year: year,
        totalSales: yearlySalesMap.get(year) || 0,
      }));

      res.status(200).json(realYearlySalesData);
    } catch (error: any) {
      console.error('❌ Error al obtener ventas anuales:', error.message, error.stack);
      res.status(500).json({ error: 'Error interno del servidor al obtener ventas anuales.' });
    }
  },
};