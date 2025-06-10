-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('SENDING', 'SENT', 'DELIVERED', 'READ');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "status" "StatusType" NOT NULL DEFAULT 'SENT';

-- CreateIndex
CREATE INDEX "Message_status_createdAt_idx" ON "Message"("status", "createdAt");
