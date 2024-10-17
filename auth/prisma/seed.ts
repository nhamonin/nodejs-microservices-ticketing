import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const email = 'admin@example.com';
const password = 'T8xvB2Lp';

async function main() {
  const saltRounds = 10;

  await prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, saltRounds),
    },
  });
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
