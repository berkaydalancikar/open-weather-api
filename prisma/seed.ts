import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.users.findUnique({
    where: { email: 'admin' },
  });

  if (!existing) {
    const hashedPassword = await bcrypt.hash('admin', 10);
    await prisma.users.create({
      data: {
        email: 'admin',
        password: hashedPassword,
        role: 1,
      },
    });
    console.log('Default admin user created');
  } else {
    console.log('Admin user already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });