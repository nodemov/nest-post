-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "isActive" SET DEFAULT false;

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);
