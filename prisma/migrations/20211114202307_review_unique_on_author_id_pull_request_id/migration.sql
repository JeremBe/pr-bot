/*
  Warnings:

  - A unique constraint covering the columns `[authorId,pull_requestId]` on the table `Reviewer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reviewer_authorId_pull_requestId_key" ON "Reviewer"("authorId", "pull_requestId");
