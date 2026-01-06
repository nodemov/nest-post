import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Posts (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean up database before each test
    await prisma.post.deleteMany({});
  });

  describe('/posts (POST)', () => {
    it('should create a new post', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .send({
          title: 'Test Post',
          detail: 'Test Detail',
          cover: 'https://example.com/cover.jpg',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Test Post');
          expect(res.body.detail).toBe('Test Detail');
          expect(res.body.cover).toBe('https://example.com/cover.jpg');
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
        });
    });

    it('should create a post without cover', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .send({
          title: 'Test Post',
          detail: 'Test Detail',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.cover).toBeNull();
        });
    });

    it('should return 400 when title is missing', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .send({
          detail: 'Test Detail',
        })
        .expect(400);
    });

    it('should return 400 when detail is missing', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .send({
          title: 'Test Post',
        })
        .expect(400);
    });

    it('should return 400 when extra fields are provided', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .send({
          title: 'Test Post',
          detail: 'Test Detail',
          extraField: 'should not be here',
        })
        .expect(400);
    });
  });

  describe('/posts (GET)', () => {
    it('should return all active posts', async () => {
      // Create test posts
      await prisma.post.createMany({
        data: [
          { title: 'Post 1', detail: 'Detail 1' },
          { title: 'Post 2', detail: 'Detail 2' },
          { title: 'Deleted Post', detail: 'Detail 3', deletedAt: new Date() },
        ],
      });

      return request(app.getHttpServer())
        .get('/posts')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(2);
          expect(res.body[0].title).toBeDefined();
        });
    });

    it('should return empty array when no posts exist', () => {
      return request(app.getHttpServer())
        .get('/posts')
        .expect(200)
        .expect([]);
    });
  });

  describe('/posts/all/with-deleted (GET)', () => {
    it('should return all posts including deleted', async () => {
      await prisma.post.createMany({
        data: [
          { title: 'Post 1', detail: 'Detail 1' },
          { title: 'Deleted Post', detail: 'Detail 2', deletedAt: new Date() },
        ],
      });

      return request(app.getHttpServer())
        .get('/posts/all/with-deleted')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(2);
        });
    });
  });

  describe('/posts/deleted/only (GET)', () => {
    it('should return only deleted posts', async () => {
      await prisma.post.createMany({
        data: [
          { title: 'Post 1', detail: 'Detail 1' },
          { title: 'Deleted Post', detail: 'Detail 2', deletedAt: new Date() },
        ],
      });

      return request(app.getHttpServer())
        .get('/posts/deleted/only')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(1);
          expect(res.body[0].deletedAt).toBeTruthy();
        });
    });
  });

  describe('/posts/:id (GET)', () => {
    it('should return a post by id', async () => {
      const post = await prisma.post.create({
        data: { title: 'Test Post', detail: 'Test Detail' },
      });

      return request(app.getHttpServer())
        .get(`/posts/${post.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(post.id);
          expect(res.body.title).toBe('Test Post');
        });
    });

    it('should return 404 for non-existent post', () => {
      return request(app.getHttpServer()).get('/posts/9999').expect(404);
    });

    it('should return 404 for soft-deleted post', async () => {
      const post = await prisma.post.create({
        data: {
          title: 'Deleted Post',
          detail: 'Detail',
          deletedAt: new Date(),
        },
      });

      return request(app.getHttpServer())
        .get(`/posts/${post.id}`)
        .expect(404);
    });

    it('should return 400 for invalid id', () => {
      return request(app.getHttpServer()).get('/posts/invalid').expect(400);
    });
  });

  describe('/posts/:id (PATCH)', () => {
    it('should update a post', async () => {
      const post = await prisma.post.create({
        data: { title: 'Original Title', detail: 'Original Detail' },
      });

      return request(app.getHttpServer())
        .patch(`/posts/${post.id}`)
        .send({ title: 'Updated Title' })
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('Updated Title');
          expect(res.body.detail).toBe('Original Detail');
        });
    });

    it('should return 404 when updating non-existent post', () => {
      return request(app.getHttpServer())
        .patch('/posts/9999')
        .send({ title: 'Updated Title' })
        .expect(404);
    });

    it('should return 404 when updating soft-deleted post', async () => {
      const post = await prisma.post.create({
        data: {
          title: 'Deleted Post',
          detail: 'Detail',
          deletedAt: new Date(),
        },
      });

      return request(app.getHttpServer())
        .patch(`/posts/${post.id}`)
        .send({ title: 'Updated Title' })
        .expect(404);
    });
  });

  describe('/posts/:id (DELETE)', () => {
    it('should soft delete a post', async () => {
      const post = await prisma.post.create({
        data: { title: 'Test Post', detail: 'Test Detail' },
      });

      await request(app.getHttpServer())
        .delete(`/posts/${post.id}`)
        .expect(204);

      const deletedPost = await prisma.post.findUnique({
        where: { id: post.id },
      });

      expect(deletedPost.deletedAt).toBeTruthy();
    });

    it('should return 404 when deleting non-existent post', () => {
      return request(app.getHttpServer()).delete('/posts/9999').expect(404);
    });
  });

  describe('/posts/:id/restore (PATCH)', () => {
    it('should restore a soft-deleted post', async () => {
      const post = await prisma.post.create({
        data: {
          title: 'Deleted Post',
          detail: 'Detail',
          deletedAt: new Date(),
        },
      });

      return request(app.getHttpServer())
        .patch(`/posts/${post.id}/restore`)
        .expect(200)
        .expect((res) => {
          expect(res.body.deletedAt).toBeNull();
        });
    });

    it('should return 404 when restoring non-deleted post', async () => {
      const post = await prisma.post.create({
        data: { title: 'Active Post', detail: 'Detail' },
      });

      return request(app.getHttpServer())
        .patch(`/posts/${post.id}/restore`)
        .expect(404);
    });
  });

  describe('/posts/:id/force (DELETE)', () => {
    it('should permanently delete a post', async () => {
      const post = await prisma.post.create({
        data: { title: 'Test Post', detail: 'Test Detail' },
      });

      await request(app.getHttpServer())
        .delete(`/posts/${post.id}/force`)
        .expect(204);

      const deletedPost = await prisma.post.findUnique({
        where: { id: post.id },
      });

      expect(deletedPost).toBeNull();
    });

    it('should return 404 when force deleting non-existent post', () => {
      return request(app.getHttpServer())
        .delete('/posts/9999/force')
        .expect(404);
    });
  });
});
