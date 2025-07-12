export const reviewModel = `
model Review {
  id      Int      @id @default(autoincrement())
  content String
  stars   Int
  user    User     @relation(fields: [userId], references: [id])
  userId  Int
  game    Game     @relation(fields: [gameId], references: [id])
  gameId  Int
}`;