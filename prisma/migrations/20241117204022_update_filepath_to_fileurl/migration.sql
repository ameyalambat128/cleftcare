/*
  Warnings:

  - You are about to drop the column `filePath` on the `UserAudioFile` table. All the data in the column will be lost.
  - Added the required column `fileUrl` to the `UserAudioFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserAudioFile" DROP COLUMN "filePath",
ADD COLUMN     "fileUrl" TEXT NOT NULL;
