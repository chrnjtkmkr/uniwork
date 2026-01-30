const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Create a mock user
    const user = await prisma.user.upsert({
        where: { clerkId: 'mock_user_1' },
        update: {},
        create: {
            clerkId: 'mock_user_1',
            email: 'john@uniwork.com',
            name: 'John Doe',
            avatar: 'https://github.com/shadcn.png'
        },
    });

    // Create a workspace
    const workspace = await prisma.workspace.create({
        data: {
            name: 'Main Workspace',
            type: 'startup',
            ownerId: user.id,
        },
    });

    // Create some tasks
    await prisma.task.createMany({
        data: [
            {
                title: 'Complete UniWork MVP',
                description: 'Finish all core modules and database integration.',
                status: 'in-progress',
                priority: 'urgent',
                workspaceId: workspace.id,
                creatorId: user.id,
            },
            {
                title: 'Setup Clerk Auth',
                description: 'Configure environment variables and middleware.',
                status: 'todo',
                priority: 'high',
                workspaceId: workspace.id,
                creatorId: user.id,
            },
            {
                title: 'Design Landing Page',
                description: 'Create a stunning landing page with neon green accents.',
                status: 'done',
                priority: 'medium',
                workspaceId: workspace.id,
                creatorId: user.id,
            }
        ]
    });

    console.log('Seed data created successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
