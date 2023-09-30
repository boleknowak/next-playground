/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSeeder() {
  // const test1 = await prisma.game.create({
  //   data: {
  //     name: 'Test',
  //   },
  // });
  // console.log('Seeded tests: ', [test1.id]);
}

async function main() {
  if (process.env.APP_ENV === 'production') {
    console.error('This script should not be run in production!');
    process.exit(1);
  }

  await testSeeder();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
