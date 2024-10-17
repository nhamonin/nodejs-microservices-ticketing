import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const placeholderUserId = 'default-user-id';

  const ticketsData = [
    { title: 'Concert Ticket', price: '50', userId: placeholderUserId },
    { title: 'Movie Ticket', price: '12', userId: placeholderUserId },
    { title: 'Theater Ticket', price: '35', userId: placeholderUserId },
    { title: 'Sports Event Ticket', price: '75', userId: placeholderUserId },
    { title: 'Exhibition Ticket', price: '20', userId: placeholderUserId },
  ];

  await prisma.tickets.createMany({
    data: ticketsData,
  });

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
