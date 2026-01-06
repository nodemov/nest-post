import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing posts
  console.log('Clearing existing posts...');
  await prisma.post.deleteMany({});

  // Generate 250 fake posts
  console.log('Creating 250 fake posts...');
  const posts = [];

  for (let i = 1; i <= 250; i++) {
    posts.push({
      title: faker.lorem.sentence({ min: 3, max: 8 }),
      detail: faker.lorem.paragraphs({ min: 2, max: 5 }, '\n\n'),
      cover: faker.helpers.arrayElement([
        faker.image.url({ width: 800, height: 600 }),
        faker.image.urlLoremFlickr({ category: 'nature' }),
        faker.image.urlLoremFlickr({ category: 'city' }),
        faker.image.urlLoremFlickr({ category: 'technology' }),
        null, // Some posts without cover
      ]),
    });

    // Log progress every 100 posts
    if (i % 100 === 0) {
      console.log(`Created ${i} posts...`);
    }
  }

  // Insert all posts in batches for better performance
  const batchSize = 100;
  for (let i = 0; i < posts.length; i += batchSize) {
    const batch = posts.slice(i, i + batchSize);
    await prisma.post.createMany({
      data: batch,
    });
  }

  // Soft delete some random posts (about 10%)
  console.log('Soft deleting some random posts...');
  const allPosts = await prisma.post.findMany();
  const postsToDelete = faker.helpers.arrayElements(
    allPosts,
    Math.floor(allPosts.length * 0.1),
  );

  for (const post of postsToDelete) {
    await prisma.post.update({
      where: { id: post.id },
      data: { deletedAt: faker.date.recent({ days: 30 }) },
    });
  }

  const totalPosts = await prisma.post.count();
  const activePosts = await prisma.post.count({
    where: { deletedAt: null },
  });
  const deletedPosts = await prisma.post.count({
    where: { deletedAt: { not: null } },
  });

  console.log('✅ Seed completed successfully!');
  console.log(`📊 Total posts: ${totalPosts}`);
  console.log(`✨ Active posts: ${activePosts}`);
  console.log(`🗑️  Deleted posts: ${deletedPosts}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
