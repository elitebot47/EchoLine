/*
  Warnings:

  - Made the column `toId` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_toId_fkey";

-- DropIndex
DROP INDEX "Message_roomId_idx";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "toId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Message_roomId_createdAt_idx" ON "Message"("roomId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Message_fromId_createdAt_idx" ON "Message"("fromId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Message_roomId_fromId_idx" ON "Message"("roomId", "fromId");

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_toId_fkey" FOREIGN KEY ("toId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
