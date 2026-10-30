import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function test() {
  const p = await prisma.product.findFirst();
  console.log('Sample product:', p?.id, p?.name, 'SKU:', p?.sku);
  await prisma.$disconnect();
}
test();
