export const cartModel = `
model CartItem {
  id     Int   @id @default(autoincrement())
  game   Game  @relation(fields: [gameId], references: [id])
  gameId Int
  user   User  @relation(fields: [userId], references: [id])
  userId Int
}`;