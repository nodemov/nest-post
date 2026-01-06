/*
  Warnings:

  - You are about to drop the column `slug` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "slug",
ALTER COLUMN "isActive" SET DEFAULT false;

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
