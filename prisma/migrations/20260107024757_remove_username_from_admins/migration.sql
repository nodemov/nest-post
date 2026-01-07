/*
  Warnings:

  - You are about to drop the column `username` on the `admins` table. All the data in the column will be lost.
  - Made the column `email` on table `admins` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "admins_username_key";

-- AlterTable
ALTER TABLE "admins" DROP COLUMN "username",
ALTER COLUMN "email" SET NOT NULL;
