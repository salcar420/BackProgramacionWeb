export const orderModel = `
model Order {
  id        Int      @id @default(autoincrement())
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  total     Float
  createdAt DateTime @default(now())
}`;
