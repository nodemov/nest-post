# ตัวอย่าง NestJS Prisma PostgreSQL CRUD

แอปพลิเคชัน NestJS ที่ใช้ Prisma ORM และ PostgreSQL สำหรับจัดการโพสต์

## ฟีเจอร์

- ✅ การทำ CRUD operations สำหรับโพสต์
- ✅ Smart pagination ในทุกๆ list endpoints (query params แบบ optional)
- ✅ ฟังก์ชัน Soft delete พร้อมความสามารถในการกลับคืน
- ✅ ฐานข้อมูล PostgreSQL พร้อม Prisma ORM
- ✅ การตรวจสอบข้อมูลด้วย class-validator
- ✅ การจัดการ exception แบบ global
- ✅ แนวทางปฏิบัติที่ดีของ REST API
- ✅ Database seeder พร้อมโพสต์ทดสอบ 500 รายการ

## สิ่งที่ต้องมีก่อนเริ่มใช้งาน

- Node.js (v18+)
- PostgreSQL database
- npm หรือ yarn

## การติดตั้ง

1. ติดตั้ง dependencies:
```bash
npm install
```

2. ตั้งค่า environment variables:
สร้างไฟล์ `.env` ในไดเรกทอรีหลัก:
```
DATABASE_URL="postgresql://postgres:@127.0.0.1:5432/nest_posts?schema=public"
TZ=UTC
```

3. สร้าง Prisma Client:
```bash
npx prisma generate
```

4. รัน database migrations:
```bash
npx prisma migrate dev --name init
```

## การรันแอปพลิเคชัน

### โหมด Development
```bash
npm run start:dev
```

### โหมด Production
```bash
npm run build
npm run start:prod
```

แอปพลิเคชันจะทำงานที่ `http://localhost:3000`

## เอกสาร API

เมื่อแอปพลิเคชันทำงานแล้ว คุณสามารถเข้าถึง **เอกสาร Swagger API** ได้ที่:

**http://localhost:3000/api**

Swagger UI ให้บริการ:
- การทดสอบ API แบบ Interactive
- เอกสาร endpoint ที่สมบูรณ์
- Request/response schemas
- ฟีเจอร์ Try it out สำหรับทุก endpoints

## API Endpoints

### Posts

| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| GET | `/posts` | ดึงโพสต์ที่ active ทั้งหมด (รองรับ pagination ด้วย ?page&limit) |
| GET | `/posts/all/with-deleted` | ดึงโพสต์ทั้งหมดรวมทั้งที่ถูกลบ (รองรับ pagination) |
| GET | `/posts/deleted/only` | ดึงเฉพาะโพสต์ที่ถูกลบ (รองรับ pagination) |
| GET | `/posts/:id` | ดึงโพสต์ตาม ID |
| POST | `/posts` | สร้างโพสต์ใหม่ |
| PATCH | `/posts/:id` | อัปเดตโพสต์ |
| PATCH | `/posts/:id/restore` | กลับคืนโพสต์ที่ถูก soft-delete |
| DELETE | `/posts/:id` | Soft delete โพสต์ |
| DELETE | `/posts/:id/force` | ลบโพสต์ถาวร |

### ตัวอย่างการใช้งาน

#### สร้างโพสต์
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "detail": "This is the content of my first post",
    "cover": "https://example.com/image.jpg"
  }'
```

#### ดึงโพสต์ทั้งหมด
```bash
# ดึงโพสต์ทั้งหมด (ไม่มี pagination)
curl http://localhost:3000/posts

# ดึงโพสต์แบบ pagination - หน้า 1 พร้อม limit เริ่มต้น (10 รายการ)
curl http://localhost:3000/posts?page=1

# ดึงโพสต์แบบ pagination - หน้า 2 พร้อม 20 รายการต่อหน้า
curl http://localhost:3000/posts?page=2&limit=20
```

#### ดึงโพสต์แบบ Pagination พร้อม Metadata
```bash
# endpoint ใดๆ ที่มี page/limit จะคืนค่าแบบ paginated response:
curl "http://localhost:3000/posts?page=1&limit=10"
curl "http://localhost:3000/posts/all/with-deleted?page=1&limit=20"
curl "http://localhost:3000/posts/deleted/only?page=1&limit=15"

# Response จะรวม pagination metadata:
# {
#   "data": [...posts...],
#   "meta": {
#     "total": 450,
#     "page": 1,
#     "limit": 10,
#     "totalPages": 45,
#     "hasNextPage": true,
#     "hasPreviousPage": false
#   }
# }
```

#### ดึงโพสต์ตาม ID
```bash
curl http://localhost:3000/posts/1
```

#### อัปเดตโพสต์
```bash
curl -X PATCH http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title"
  }'
```

#### Soft Delete โพสต์
```bash
curl -X DELETE http://localhost:3000/posts/1
```

#### กลับคืนโพสต์ที่ถูกลบ
```bash
curl -X PATCH http://localhost:3000/posts/1/restore
```

#### ดึงโพสต์ที่ถูกลบ
```bash
curl http://localhost:3000/posts/deleted/only
```

#### ลบโพสต์ถาวร (Force Delete)
```bash
curl -X DELETE http://localhost:3000/posts/1/force
```

## โครงสร้างฐานข้อมูล

### Post Model

| ฟิลด์ | ประเภท | คำอธิบาย |
|-------|--------|----------|
| id | Int | Primary key (auto-increment) |
| title | String | ชื่อโพสต์ (จำเป็น) |
| detail | String | เนื้อหาโพสต์ (จำเป็น) |
| cover | String | URL รูปภาพปก (ไม่บังคับ) |
| slug | String | URL slug (ไม่บังคับ) |
| isActive | Boolean | สถานะว่าโพสต์ active หรือไม่ (ค่าเริ่มต้น: true) |
| deletedAt | DateTime | เวลาที่ Soft delete (nullable) |
| createdAt | DateTime | เวลาที่สร้าง |
| updatedAt | DateTime | เวลาที่อัปเดตล่าสุด |

## คำสั่ง Prisma

```bash
# สร้าง Prisma Client
npx prisma generate

# สร้าง migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Seed ฐานข้อมูลด้วยโพสต์ทดสอบ 500 รายการ
npm run prisma:seed

# เปิด Prisma Studio
npx prisma studio

# Reset ฐานข้อมูล
npx prisma migrate reset
```

## แนวทางที่แนะนำสำหรับการใช้ฐานข้อมูลร่วมกัน

เมื่อ NestJS API ของคุณใช้ฐานข้อมูลร่วมกับแอปพลิเคชันอื่นๆ (เช่น Laravel backoffice) ให้ปฏิบัติตามแนวทางที่ดีเหล่านี้:

### 1. รักษา Prisma Schema ให้ sync กับตารางทั้งหมด

เพิ่มตารางฐานข้อมูลทั้งหมดลงใน `prisma/schema.prisma` แม้ว่าจะถูกจัดการโดยแอปพลิเคชันอื่นก็ตาม:

```prisma
// ตารางที่ NestJS จัดการ
model Post {
  id        Int       @id @default(autoincrement())
  title     String
  // ... ฟิลด์อื่นๆ
  @@map("posts")
}

// ตารางที่ Laravel จัดการ (เพิ่มเข้ามาด้วย!)
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("users")
}
```

### 2. Pull การเปลี่ยนแปลงจากภายนอกอย่างสม่ำเสมอ

หลังจากแอปพลิเคชันภายนอกแก้ไขฐานข้อมูล:

```bash
# 1. Pull schema ฐานข้อมูลปัจจุบัน
npx prisma db pull

# 2. สร้าง Prisma Client
npx prisma generate

# 3. สร้าง migration เพื่อเก็บการเปลี่ยนแปลง (สำคัญมาก!)
npx prisma migrate dev --name sync_with_external_changes
```

### 3. ใช้คำสั่ง Migration ที่ถูกต้อง

**Development:**
```bash
# Apply migrations ใหม่
npx prisma migrate dev

# หลีกเลี่ยง: ใช้ reset เฉพาะใน development และด้วยความระมัดระวัง
npx prisma migrate reset
```

**Production:**
```bash
# Deploy migrations (ปลอดภัย ไม่มีการสูญเสียข้อมูล)
npx prisma migrate deploy

# ห้ามใช้ migrate reset ใน production
```

### 4. บันทึกตารางที่ใช้ร่วมกัน

เพิ่มส่วนเพื่อติดตามว่าแอปพลิเคชันใดจัดการตารางใด:

**ตารางฐานข้อมูลที่ใช้ร่วมกัน:**
- `posts` - จัดการโดย NestJS API
- `users` - ใช้ร่วมกัน (ทั้งสองแอปพลิเคชันสามารถแก้ไขได้)

### 5. ทางเลือก: ใช้ Database Schemas/Namespaces

แยกตารางไปยัง PostgreSQL schemas ที่แตกต่างกันเพื่อหลีกเลี่ยงความขัดแย้ง:

```sql
-- ตาราง Laravel
CREATE SCHEMA backoffice;
CREATE TABLE backoffice.users (...);

-- ตาราง NestJS อยู่ใน public schema
```

อัปเดตไฟล์ `.env`:
```env
DATABASE_URL="postgresql://postgres:@127.0.0.1:5432/nest_posts?schema=public"
```

### 6. สำรองข้อมูลก่อน Reset

หากจำเป็นต้องใช้ `migrate reset`:

```bash
# 1. สำรองข้อมูลตารางภายนอกก่อน
pg_dump -h 127.0.0.1 -U postgres -t users nest_posts > users_backup.sql

# 2. รัน reset
npx prisma migrate reset

# 3. กลับคืนตารางภายนอก
psql -h 127.0.0.1 -U postgres -d nest_posts < users_backup.sql
```

### ⚠️ คำเตือนสำคัญ

**ไม่มี migrations ที่เหมาะสม**: การรัน `npx prisma migrate reset` จะลบตารางใดๆ ที่ไม่ได้ถูกติดตามใน migration history แม้ว่าจะอยู่ใน `schema.prisma` ก็ตาม

**มี migrations ที่เหมาะสม**: ตารางทั้งหมดที่ถูกกำหนดใน `schema.prisma` และ migration history จะถูกรักษาไว้และกลับคืนอย่างถูกต้อง

## การ Sync การเปลี่ยนแปลงฐานข้อมูลจากแหล่งภายนอก

หากแอปพลิเคชันอื่น (เช่น Laravel backoffice) แก้ไข schema ฐานข้อมูล คุณสามารถ sync การเปลี่ยนแปลงเหล่านั้นมายัง NestJS API ของคุณได้:

### ขั้นตอนที่ 1: Introspect ฐานข้อมูล
Pull schema ฐานข้อมูลปัจจุบันเข้าไปในไฟล์ Prisma schema ของคุณ:
```bash
npx prisma db pull
```

คำสั่งนี้จะอัปเดต `prisma/schema.prisma` พร้อมฟิลด์ใหม่หรือการเปลี่ยนแปลงที่ทำกับฐานข้อมูล

### ขั้นตอนที่ 2: สร้าง Prisma Client
อัปเดต Prisma Client ด้วย schema ใหม่:
```bash
npx prisma generate
```

### ขั้นตอนที่ 3: สร้างไฟล์ Migration
**สำคัญ**: หลังจาก pull การเปลี่ยนแปลง คุณต้องสร้างไฟล์ migration เพื่อเก็บการเปลี่ยนแปลงเหล่านี้:
```bash
npx prisma migrate dev --name describe_your_changes
```

สิ่งนี้ช่วยให้แน่ใจว่าเมื่อคุณรัน `npx prisma migrate reset` ในอนาคต การเปลี่ยนแปลงจากภายนอกจะไม่หายไป

### ขั้นตอนที่ 4: อัปเดตโค้ดของคุณ
อัปเดต DTOs และ entities ของคุณด้วยตนเองเพื่อสะท้อนฟิลด์ใหม่:
- อัปเดต `src/posts/entities/post.entity.ts` เพื่อเพิ่มฟิลด์ใหม่
- อัปเดต `src/posts/dto/create-post.dto.ts` สำหรับการสร้าง
- อัปเดต `src/posts/dto/update-post.dto.ts` สำหรับการอัปเดต

### ขั้นตอนที่ 5: ทดสอบการเปลี่ยนแปลงของคุณ
รัน tests เพื่อให้แน่ใจว่าทุกอย่างทำงานอย่างถูกต้อง:
```bash
npm test
```

### ตัวอย่างที่สมบูรณ์: หลังจาก Laravel เพิ่มฟิลด์ `slug` และ `isActive`
```bash
# 1. Pull schema ฐานข้อมูล
npx prisma db pull

# 2. สร้าง Prisma Client
npx prisma generate

# 3. สร้าง migration เพื่อเก็บการเปลี่ยนแปลง (ขั้นตอนสำคัญ!)
npx prisma migrate dev --name add_slug_and_is_active

# 4. อัปเดต DTOs และ entities ของคุณด้วยตนเอง
# 5. รัน tests
npm test
```

### ⚠️ คำเตือนสำคัญ

**ไม่มีขั้นตอนที่ 3**: หากคุณข้ามการสร้าง migration หลังจาก `db pull` การรัน `npx prisma migrate reset` จะลบการเปลี่ยนแปลงจากภายนอกเพราะมันมีอยู่เฉพาะใน `schema.prisma` แต่ไม่อยู่ในไฟล์ migration

**มีขั้นตอนที่ 3**: ไฟล์ migration จะรวมการเปลี่ยนแปลงทั้งหมด ดังนั้น `migrate reset` จะกลับคืนทุกอย่างอย่างถูกต้อง

## การทดสอบ

```bash
# รัน unit tests
npm test

# รัน tests ใน watch mode
npm run test:watch

# รัน tests พร้อม coverage
npm run test:cov

# รัน e2e tests
npm run test:e2e
```

## โครงสร้างโปรเจค

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

## แนวทางปฏิบัติที่ดีที่ใช้ในโปรเจคนี้

1. **Separation of Concerns**: รูปแบบ Controller, Service และ Repository
2. **DTO Validation**: ใช้ class-validator สำหรับการตรวจสอบ input
3. **Global Validation Pipe**: การตรวจสอบ requests ทั้งหมดโดยอัตโนมัติ
4. **Error Handling**: HTTP exceptions ที่เหมาะสม (NotFoundException)
5. **Type Safety**: รองรับ TypeScript อย่างเต็มรูปแบบด้วย Prisma
6. **Module Organization**: โครงสร้าง module แบบแยกตาม feature
7. **Database Connection**: Prisma module แบบ global พร้อม lifecycle hooks
8. **RESTful API**: ปฏิบัติตามแนวทาง REST
9. **Soft Delete**: การลบแบบไม่ทำลายพร้อมฟังก์ชันกลับคืน

## License

MIT
