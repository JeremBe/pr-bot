/*
  Warnings:

  - Changed the type of `status` on the `Reviewer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('approved', 'changes_requested', 'commented', 'review_requested');

-- AlterTable
ALTER TABLE "Reviewer" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL;

-- CreateIndex
CREATE INDEX "Reviewer_pull_requestId_status_authorId_idx" ON "Reviewer"("pull_requestId", "status", "authorId");
