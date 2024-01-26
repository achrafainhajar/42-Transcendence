import { PrismaClient } from '@prisma/client';
// seed some users

const prisma = new PrismaClient();

const users = [
  {
    id: '034468a5-fe52-481f-88e8-d57bc768806a',
    oauth_id: '98931',
    username: 'ainhajar',
    email: 'ainhajar@student.1337.ma',
  },
  {
    id: '18514db9-fe45-437b-9ccc-7686984ecc3a',
    oauth_id: '98932',
    username: 'asouinia',
    email: 'asouinia@student.1337.ma',
  },
];

const acheivements = [
  {
	id:"02cd363c-0c0e-4667-8ba5-b7f4d41c69c0",
    name: 'First Game',
    description: 'Play your first game',
    icon_url: 'symbol-1.png',
    points: 0,
  },
  {
	id:"11805883-ae42-43f0-98e2-2cddd5383bb5",
    name: 'First Win',
    description: 'Win your first game',
    icon_url: 'symbol-2.png',
    points: 1,
  },
  {
	id:"12a20c5d-d943-40da-b724-7451a6ba8a56",
    name: 'First Loss',
    description: 'Lose your first game',
    icon_url: 'symbol-3.png',
    points: 0,
  },
  {
	id:"142853ad-1f02-4d1b-a2e1-0f15423e4973",
    name: '3 Wins',
    description: 'Win 3 games',
    icon_url: 'symbol-4.png',
    points: 3,
  },
  {
	id:"16c90aa0-6ed9-4aac-b41d-ef40fe032c8b",
    name: '5 Wins',
    description: 'Win 5 games',
    icon_url: 'symbol-5.png',
    points: 5,
  },
  {
	id:"2b1beb30-4080-4082-8fbd-ab49db7eecd0",
    name: '10 Wins',
    description: 'Win 10 games',
    icon_url: 'symbol-6.png',
    points: 10,
  },
  {
	id:"1d1c2fd5-dbc5-462f-8a6a-416c1631e51e",
    name: '20 Wins',
    description: 'Win 20 games',
    icon_url: 'symbol-7.png',
    points: 20,
  },
];

const main = async () => {
  // await prisma.user.createMany({
  //   data: users,
  //   //  skipDuplicates: true,
  // });
  await prisma.achievement.createMany({
    data: acheivements,
    skipDuplicates: true,
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
