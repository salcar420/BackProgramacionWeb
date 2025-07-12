// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Insertar categorías
  await prisma.categoria.createMany({
    data: [
      { nombre: 'Aventura' },
      { nombre: 'Estrategia' },
    ],
  });

  // Insertar plataformas
  await prisma.plataforma.createMany({
    data: [
      { nombre: 'PC' },
      { nombre: 'PlayStation' },
      { nombre: 'Xbox' },
    ],
  });

  console.log('¡Datos iniciales insertados!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
