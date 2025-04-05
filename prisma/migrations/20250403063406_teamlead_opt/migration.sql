-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_teamLeadId_fkey";

-- AlterTable
ALTER TABLE "Department" ALTER COLUMN "teamLeadId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_teamLeadId_fkey" FOREIGN KEY ("teamLeadId") REFERENCES "Developer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
