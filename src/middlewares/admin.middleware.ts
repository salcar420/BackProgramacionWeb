// src/middlewares/admin.middleware.ts
import { Request, Response, NextFunction } from 'express';

// *** IMPORTANTE: ESTE BLOQUE ES CRÍTICO ***
// Este `declare module` extiende la interfaz `Request` de Express
// para que TypeScript sepa que `req.user` puede existir y qué forma tiene.
// Si este bloque te causa conflictos en otros archivos .d.ts,
// deberías moverlo a un archivo separado como `src/types/express.d.ts`.
// Pero para que funcione rápido, déjalo aquí por ahora.
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number;
      email: string;
      role: string; // Asegúrate de que este 'role' coincida con lo que tu JWT o autenticación devuelve
      // Añade aquí cualquier otra propiedad que tu middleware de autenticación adjunte al objeto 'user'
    };
  }
}

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  // 1. Verifica si el usuario está autenticado y si se adjuntó un objeto 'user' a la solicitud.
  if (!req.user) {
    return res.status(401).json({ error: 'No autenticado. Por favor, inicie sesión.' });
  }

  // 2. Verifica el rol del usuario.
  //    AJUSTA ESTA LÓGICA:
  //    - Si tu modelo User tiene un campo `role` y es de tipo String:
  //      if (req.user.role === 'admin') {
  //    - Si tu modelo User usa `estado: Boolean` donde `false` significa admin:
  //      if (req.user.estado === false) { // Asumiendo que 'estado' es parte de req.user
  if (req.user.role === 'admin') { // <-- Usa esta línea si tienes 'role: string' en tu modelo User
    next(); // El usuario es administrador, continúa
  } else {
    res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' }); // 403 Forbidden
  }
};