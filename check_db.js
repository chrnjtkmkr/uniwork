const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const userCount = await prisma.user.count();
    const users = await prisma.user.findMany();
    console.log('User Count:', userCount);
    console.log('Users:', JSON.stringify(users, null, 2));

    const workspaceCount = await prisma.workspace.count();
    console.log('Workspace Count:', workspaceCount);

    const taskCount = await prisma.task.count();
    console.log('Task Count:', taskCount);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
