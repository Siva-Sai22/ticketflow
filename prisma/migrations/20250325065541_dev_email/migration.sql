/*
  Warnings:

  - Added the required column `email` to the `Developer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Developer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Developer" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;
