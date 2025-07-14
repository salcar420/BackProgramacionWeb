import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Eliminar juegos duplicados basados en el título
  const juegosDuplicados = await prisma.game.findMany({
    where: {},
  });

  const juegosUnicos = new Set();
  
  for (const juego of juegosDuplicados) {
    if (juegosUnicos.has(juego.title)) {
      await prisma.game.delete({
        where: { id: juego.id }, // Elimina duplicados por id
      });
    } else {
      juegosUnicos.add(juego.title);
    }
  }

  // Insertar categorías
  await prisma.categoria.createMany({
    data: [
      { nombre: 'Aventura' },
      { nombre: 'Estrategia' },
      { nombre: 'Acción' },
      { nombre: 'RPG' },
    ],
  });

  await prisma.plataforma.createMany({
    data: [
      { nombre: 'PC', image: '/Imagenes/PC3.png' },
      { nombre: 'PlayStation', image: '/Imagenes/PS5.png' },
      { nombre: 'Xbox', image: '/Imagenes/XBOX.png' },
      { nombre: 'Nintendo', image: '/Imagenes/NINTENDO.png' }
    ]
  });
  
  
  

  // Crear un usuario (si no tienes uno)
  const user = await prisma.user.create({
    data: {
      name: 'Admin10235',
      email: 'admin10235@example.com',
      password: 'hashedpassword123', // En la vida real, usa bcrypt
    },
  });

  // Obtener IDs para categoría y plataforma
  const aventura = await prisma.categoria.findFirst({ where: { nombre: 'Aventura' } });
  const pc = await prisma.plataforma.findFirst({ where: { nombre: 'PC' } });
  const accion = await prisma.categoria.findFirst({ where: { nombre: 'Acción' } });
  const rpg = await prisma.categoria.findFirst({ where: { nombre: 'RPG' } });

  if (!aventura || !pc || !accion || !rpg) throw new Error('Categoría o plataforma no encontrada');

  // Juegos a insertar
  const juegos = [
    {
      title: 'Street Fighter 6',
      description: 'Nuevo capítulo de la legendaria saga de juegos de lucha.',
      price: 49.99,
      publisher: 'Capcom',
      categoriaId: accion.id,
      plataformaId: pc.id,
      image: '/Imagenes/SF6.avif',
      bannerImage: '/Imagenes/SF6_BANNER.avif',
      estado: true,
      estaOferta: false,
    },
    {
      title: 'Mario Kart Deluxe 8',
      description: 'El juego de carreras más divertido y rápido de Nintendo.',
      price: 49.99,
      publisher: 'Nintendo',
      categoriaId: aventura.id,
      plataformaId: pc.id,
      image: '/Imagenes/MK.jpeg',
      bannerImage: '/Imagenes/MK_BANNER.avif',
      estado: true,
      estaOferta: false,
    },
    {
      title: 'The Legend of Zelda: Tears of the Kingdom',
      description: 'Videojuego de acción-aventura y mundo abierto de 2023 de la serie The Legend of Zelda.',
      price: 59.99,
      publisher: 'Nintendo',
      categoriaId: aventura.id,
      plataformaId: pc.id,
      image: '/Imagenes/ZELDA COVER.jpg',
      bannerImage: '/Imagenes/ZELDA.avif',
      estado: true,
      estaOferta: false,
    },
    {
      title: 'Elden Ring',
      description: 'Un RPG de acción de mundo abierto de FromSoftware, basado en el trabajo de George R. R. Martin.',
      price: 59.99,
      publisher: 'Bandai Namco Entertainment',
      categoriaId: rpg.id,
      plataformaId: pc.id,
      image: '/Imagenes/ELDENRING.jpg',
      bannerImage: '/Imagenes/EBANNER.png',
      estado: true,
      estaOferta: false,
    },
    {
      title: 'Marvel\'s Spider-Man 2',
      description: 'Secuela del popular juego de acción-aventura protagonizado por Spider-Man.',
      price: 59.99,
      publisher: 'Sony Interactive Entertainment',
      categoriaId: accion.id,
      plataformaId: pc.id,
      image: '/Imagenes/SPIDERMAN.png',
      bannerImage: '/Imagenes/SPID2.png',
      estado: true,
      estaOferta: false,
    },
    {
      title: 'Cyberpunk 2077',
      description: 'Juego de rol y acción en un futuro distópico en la ciudad de Night City.',
      price: 49.99,
      publisher: 'CD Projekt Red',
      categoriaId: rpg.id,
      plataformaId: pc.id,
      image: '/Imagenes/CYBERPUNK.jpeg',
      bannerImage: '/Imagenes/CYBERP.jpg',
      estado: true,
      estaOferta: false,
    },
    {
      title: 'Astro Bot Rescue Mission',
      description: 'Un juego de acción y aventuras de realidad virtual para PlayStation VR.',
      price: 29.99,
      publisher: 'Sony Interactive Entertainment',
      categoriaId: aventura.id,
      plataformaId: pc.id,
      image: '/Imagenes/AB.png.webp',
      bannerImage: '/Imagenes/ABANNEER.jpg',
      estado: true,
      estaOferta: true,
    },
    {
      title: 'GTA V',
      description: 'Un juego de acción y aventuras en mundo abierto con una historia envolvente.',
      price: 29.99,
      publisher: 'Rockstar Games',
      categoriaId: accion.id,
      plataformaId: pc.id,
      image: '/Imagenes/GTA.jpg',
      bannerImage: '/Imagenes/GTA54.jpeg',
      estado: true,
      estaOferta: true,
    },
    {
      title: 'God of War Ragnarok',
      description: 'Una épica secuela de God of War, centrada en la mitología nórdica.',
      price: 49.99,
      publisher: 'Sony Interactive Entertainment',
      categoriaId: aventura.id,
      plataformaId: pc.id,
      image: '/Imagenes/GOW.png',
      bannerImage: '/Imagenes/gw.jpg',
      estado: true,
      estaOferta: false,
    },
    {
      title: 'Red Dead Redemption 2',
      description: 'Un juego de acción-aventura en mundo abierto que sigue la vida de los forajidos.',
      price: 39.99,
      publisher: 'Rockstar Games',
      categoriaId: aventura.id,
      plataformaId: pc.id,
      image: '/Imagenes/RD2.png',
      bannerImage: '/Imagenes/RD2_banner.jpeg',
      estado: true,
      estaOferta: false,
      videoUrls: ['https://www.youtube.com/embed/tx8BPmTMS_o'],
    },
  ];

  // Inserción de juegos usando 'upsert' con 'title'
  for (const juego of juegos) {
    await prisma.game.upsert({
      where: { title: juego.title },  // Usamos 'title' como clave única
      update: {}, // No actualizamos nada, solo evitamos duplicados
      create: {
        title: juego.title,
        description: juego.description,
        price: juego.price,
        publisher: juego.publisher,
        userId: user.id,
        categoriaId: juego.categoriaId,
        plataformaId: juego.plataformaId,
        image: juego.image,
        bannerImage: juego.bannerImage,
        estado: juego.estado,
        estaOferta: juego.estaOferta,
      },
    });
  }

  console.log('¡Datos iniciales insertados con juegos!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
