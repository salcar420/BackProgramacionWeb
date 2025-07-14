import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hashear contraseña del administrador
  const adminPassword = await bcrypt.hash('AdminPass123!', 10);

  // Upsert administrador: crea o actualiza la contraseña y campos
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      password: adminPassword,
      estado: true,
      role: 'admin',
      verificationCode: null,
      token: null,
    },
    create: {
      name: 'Administrador',
      email: 'admin@example.com',
      password: adminPassword,
      estado: true,
      role: 'admin',
      verificationCode: null,
      token: null,
    },
  });

  // Hashear contraseña del usuario normal
  const userPassword = await bcrypt.hash('12345678', 10);

  // Upsert usuario normal
  const user = await prisma.user.upsert({
    where: { email: 'homeuser@example.com' },
    update: {
      password: userPassword,
      estado: true,
      role: 'user',
      verificationCode: null,
      token: null,
    },
    create: {
      name: 'Usuario Home',
      email: 'homeuser@example.com',
      password: userPassword,
      estado: true,
      role: 'user',
      verificationCode: null,
      token: null,
    },
  });

  // Crear categorías
  const [accion, aventura, rpg] = await Promise.all([
    prisma.categoria.upsert({
      where: { nombre: 'Acción' },
      update: {},
      create: { nombre: 'Acción' },
    }),
    prisma.categoria.upsert({
      where: { nombre: 'Aventura' },
      update: {},
      create: { nombre: 'Aventura' },
    }),
    prisma.categoria.upsert({
      where: { nombre: 'RPG' },
      update: {},
      create: { nombre: 'RPG' },
    }),
  ]);

  // Crear plataformas
  const plataformas = {
    PC: await prisma.plataforma.upsert({
      where: { nombre: 'PC' },
      update: {},
      create: { nombre: 'PC', imagenPlataforma: '/Imagenes/PC3.PNG' },
    }),
    PlayStation: await prisma.plataforma.upsert({
      where: { nombre: 'PlayStation' },
      update: {},
      create: { nombre: 'PlayStation', imagenPlataforma: '/Imagenes/PS5.png' },
    }),
    Xbox: await prisma.plataforma.upsert({
      where: { nombre: 'Xbox' },
      update: {},
      create: { nombre: 'Xbox', imagenPlataforma: '/Imagenes/XBOX.png' },
    }),
    Nintendo: await prisma.plataforma.upsert({
      where: { nombre: 'Nintendo' },
      update: {},
      create: { nombre: 'Nintendo', imagenPlataforma: '/Imagenes/NINTENDO.png' },
    }),
  };

  // Juegos a insertar
  const juegos = [
    {
      title: 'NBA 2K25',
      description: 'La entrega anual de la serie NBA 2K...',
      price: 53.99,
      publisher: '2K Sports',
      image: '/Imagenes/2k25.png',
      bannerImage: '/Imagenes/NBA2.jpg',
      categoria: accion,
      plataforma: plataformas.Nintendo,
    },
    {
      title: 'Diablo IV',
      description: 'Regresa el oscuro mundo de Santuario...',
      price: 29.99,
      publisher: 'Blizzard',
      image: '/Imagenes/DiabloiV.png',
      bannerImage: '/Imagenes/DiabloiV_banner.png',
      categoria: rpg,
      plataforma: plataformas.PlayStation,
    },
    {
      title: 'Tekken 8',
      description: 'Nueva entrega del clásico de peleas...',
      price: 5.99,
      publisher: 'Bandai Namco',
      image: '/Imagenes/TEKKEN8.png',
      bannerImage: '/Imagenes/TEKKEN8.png',
      categoria: accion,
      plataforma: plataformas.Xbox,
    },
    {
      title: 'Final Fantasy VII Rebirth',
      description: 'Segunda parte del remake de FFVII...',
      price: 44.99,
      publisher: 'Square Enix',
      image: '/Imagenes/FF.png',
      bannerImage: '/Imagenes/FF_BANNER.jpg',
      categoria: rpg,
      plataforma: plataformas.Nintendo,
    },
    {
      title: 'Call of Duty: Modern Warfare III',
      description: 'Continuación directa de MWII...',
      price: 69.29,
      publisher: 'Activision',
      image: '/Imagenes/COD.png',
      bannerImage: '/Imagenes/COD.webp',
      categoria: accion,
      plataforma: plataformas.PlayStation,
    },
    {
      title: 'Resident Evil 4 (Remake)',
      description: 'Reimaginación moderna del clásico de 2005...',
      price: 24.99,
      publisher: 'Capcom',
      image: '/Imagenes/RE.png',
      bannerImage: '/Imagenes/RE_BANNER.jpg',
      categoria: accion,
      plataforma: plataformas.PC,
    },
    {
      title: 'Hogwarts Legacy',
      description: 'Ambientado en el universo de Harry Potter...',
      price: 53.99,
      publisher: 'Warner Bros',
      image: '/Imagenes/HL.webp',
      bannerImage: '/Imagenes/HL_BANNER.avif',
      categoria: aventura,
      plataforma: plataformas.PlayStation,
    },
    {
      title: 'The Legend of Zelda: Tears of the Kingdom',
      description: 'Secuela de Breath of the Wild...',
      price: 53.99,
      publisher: 'Nintendo',
      image: '/Imagenes/ZELDA COVER.jpg',
      bannerImage: '/Imagenes/ZELDA.avif',
      categoria: aventura,
      plataforma: plataformas.Nintendo,
    },
    {
      title: 'Street Fighter 6',
      description: 'La legendaria saga de lucha evoluciona...',
      price: 5.99,
      publisher: 'Capcom',
      image: '/Imagenes/SF6.avif',
      bannerImage: '/Imagenes/SF6_BANNER.avif',
      categoria: accion,
      plataforma: plataformas.Xbox,
    },
    {
      title: 'Starfield',
      description: 'Aventura intergaláctica de exploración...',
      price: 29.99,
      publisher: 'Bethesda',
      image: '/Imagenes/STARFIELD.png',
      bannerImage: '/Imagenes/STARFIEL_BANNER.jpg',
      categoria: rpg,
      plataforma: plataformas.Xbox,
    },
  ];

  for (const juego of juegos) {
    const createdGame = await prisma.game.upsert({
      where: { title: juego.title },
      update: {},
      create: {
        title: juego.title,
        description: juego.description,
        price: juego.price,
        publisher: juego.publisher,
        userId: user.id,
        categoriaId: juego.categoria.id,
        plataformaId: juego.plataforma.id,
        image: juego.image,
        bannerImage: juego.bannerImage,
        estaOferta: true,
        estado: true,
      },
    });

    await prisma.review.createMany({
      data: [
        {
          userId: user.id,
          gameId: createdGame.id,
          stars: 5,
          content: "¡Increíble juego, superó mis expectativas!",
        },
        {
          userId: user.id,
          gameId: createdGame.id,
          stars: 4,
          content: "Muy entretenido, aunque podría mejorar en gráficos.",
        },
        {
          userId: user.id,
          gameId: createdGame.id,
          stars: 3,
          content: "Está bien, pero la jugabilidad no me convenció del todo.",
        },
      ],
    });
  }

  console.log('🌱 Juegos y reseñas insertados con éxito');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
