export const gameModel = `
model Game {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  price       Float
  platform    String
  category    String
  createdAt   DateTime @default(now())
  reviews     Review[]
}`;
