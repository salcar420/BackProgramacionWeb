import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Insertar usuarios
  const user1 = await prisma.user.create({
    data: {
      name: 'Usuario 1333346',
      email: 'usuario1333346@example.com',
      password: 'password123',  // Asegúrate de encriptar las contraseñas
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Usuario 2333346',
      email: 'usuario2333346@example.com',
      password: 'password123',  // Asegúrate de encriptar las contraseñas
    },
  });

  // Insertar categorías
  const accion = await prisma.categoria.create({
    data: { nombre: 'Acción' },
  });
  const aventura = await prisma.categoria.create({
    data: { nombre: 'Aventura' },
  });
  const rpg = await prisma.categoria.create({
    data: { nombre: 'RPG' },
  });

  // Insertar plataformas con imagen usando upsert
  const plataformas = [
    {
      nombre: 'PC',
      imagenPlataforma: '/Imagenes/PS5.png',  // Ruta de la imagen
    },
    {
      nombre: 'PlayStation',
      imagenPlataforma: '/Imagenes/PS5.png',  // Ruta de la imagen
    },
    {
      nombre: 'Xbox',
      imagenPlataforma: '/Imagenes/PS5.png',  // Ruta de la imagen
    }
  ];

  for (const plataforma of plataformas) {
    await prisma.plataforma.upsert({
      where: { nombre: plataforma.nombre }, // Verifica si la plataforma ya existe por su nombre
      update: {}, // Si existe, no se actualiza nada
      create: plataforma, // Si no existe, se crea
    });
  }

  // Insertar juegos (con las relaciones de categorías y plataformas)
  const juegos = [
    {
      title: 'Street Fighter 6',
      description: 'Nuevo capítulo de la legendaria saga de juegos de lucha.',
      price: 49.99,
      publisher: 'Capcom',
      categoriaId: accion.id,
      plataformaId: 1,  // Asumimos que 'PC' tiene id = 1, usa el id real
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
      plataformaId: 1,  // Asumimos que 'PC' tiene id = 1, usa el id real
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

  for (const juego of juegos) {
    await prisma.game.upsert({
      where: { title: juego.title }, // Usamos 'title' como clave única
      update: {}, // Si el juego ya existe, no se actualiza nada
      create: {
        title: juego.title,
        description: juego.description,
        price: juego.price,
        publisher: juego.publisher,
        userId: user1.id,  // O user2.id si prefieres otro usuario
        categoriaId: juego.categoriaId,
        plataformaId: juego.plataformaId,
        image: juego.image,
        bannerImage: juego.bannerImage,
        estado: juego.estado,
        estaOferta: juego.estaOferta,
      },
    });
  }

  // Consultar juegos con la plataforma
  const juegosConPlataforma = await prisma.game.findMany({
    include: {
      plataforma: true, // Incluir los datos de la plataforma asociada
    },
  });

  juegosConPlataforma.forEach(juego => {
    console.log('Juego:', juego.title);
    console.log('Imagen Plataforma:', juego.plataforma.imagenPlataforma); // Esto debería mostrar la imagen de la plataforma
  });

  console.log('¡Datos iniciales insertados!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });