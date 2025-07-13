"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// prisma/seed.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Insertar categorías
        yield prisma.categoria.createMany({
            data: [
                { nombre: 'Aventura' },
                { nombre: 'Estrategia' },
            ],
        });
        // Insertar plataformas
        yield prisma.plataforma.createMany({
            data: [
                { nombre: 'PC' },
                { nombre: 'PlayStation' },
                { nombre: 'Xbox' },
            ],
        });
        console.log('¡Datos iniciales insertados!');
    });
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
