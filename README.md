# NestJS Prisma PostgreSQL CRUD Example

A NestJS application with Prisma ORM and PostgreSQL for managing posts.

## Features

- ✅ CRUD operations for posts
- ✅ Soft delete functionality with restore capability
- ✅ PostgreSQL database with Prisma ORM
- ✅ Data validation with class-validator
- ✅ Global exception handling
- ✅ REST API best practices

## Prerequisites

- Node.js (v18+)
- PostgreSQL database
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the root directory:
```
DATABASE_URL="postgresql://postgres:@127.0.0.1:5432/nest_posts?schema=public"
```

3. Generate Prisma Client:
```bash
npx prisma generate
```

4. Run database migrations:
```bash
npx prisma migrate dev --name init
```

## Running the Application

### Development mode
```bash
npm run start:dev
```

### Production mode
```bash
npm run build
npm run start:prod
```

The application will run on `http://localhost:3000`

## API Endpoints

### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts` | Get all active posts |
| GET | `/posts/all/with-deleted` | Get all posts including deleted |
| GET | `/posts/deleted/only` | Get only deleted posts |
| GET | `/posts/:id` | Get a post by ID |
| POST | `/posts` | Create a new post |
| PATCH | `/posts/:id` | Update a post |
| PATCH | `/posts/:id/restore` | Restore a soft-deleted post |
| DELETE | `/posts/:id` | Soft delete a post |
| DELETE | `/posts/:id/force` | Permanently delete a post |

### Example Requests

#### Create a Post
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "detail": "This is the content of my first post",
    "cover": "https://example.com/image.jpg"
  }'
```

#### Get All Posts
```bash
curl http://localhost:3000/posts
```

#### Get a Post by ID
```bash
curl http://localhost:3000/posts/1
```

#### Update a Post
```bash
curl -X PATCH http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title"
  }'
```

#### Soft Delete a Post
```bash
curl -X DELETE http://localhost:3000/posts/1
```

#### Restore a Deleted Post
```bash
curl -X PATCH http://localhost:3000/posts/1/restore
```

#### Get Deleted Posts
```bash
curl http://localhost:3000/posts/deleted/only
```

#### Permanently Delete a Post (Force Delete)
```bash
curl -X DELETE http://localhost:3000/posts/1/force
```

## Database Schema

### Post Model

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key (auto-increment) |
| title | String | Post title (required) |
| detail | String | Post content (required) |
| cover | String | Cover image URL (optional) |
| deletedAt | DateTime | Soft delete timestamp (nullable) |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

## Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset
```

## Project Structure

```
src/
├── prisma/
│   ├── prisma.module.ts    # Prisma module
│   └── prisma.service.ts   # Prisma service
├── posts/
│   ├── dto/
│   │   ├── create-post.dto.ts
│   │   └── update-post.dto.ts
│   ├── entities/
│   │   └── post.entity.ts
│   ├── posts.controller.ts
│   ├── posts.module.ts
│   └── posts.service.ts
├── app.module.ts
└── main.ts
```

## Best Practices Implemented

1. **Separation of Concerns**: Controller, Service, and Repository pattern
2. **DTO Validation**: Using class-validator for input validation
3. **Global Validation Pipe**: Automatic validation of all requests
4. **Error Handling**: Proper HTTP exceptions (NotFoundException)
5. **Type Safety**: Full TypeScript support with Prisma
6. **Module Organization**: Feature-based module structure
7. **Database Connection**: Global Prisma module with lifecycle hooks
8. **RESTful API**: Following REST conventions
9. **Soft Delete**: Non-destructive delete with restore functionality

## License

UNLICENSED
