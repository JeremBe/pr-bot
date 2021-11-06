-- CreateTable
CREATE TABLE "PullReuest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "repo" TEXT NOT NULL,
    "repo_url" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PullReuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reviewer" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pull_requestId" TEXT NOT NULL,

    CONSTRAINT "Reviewer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlacklistedAuthor" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlacklistedAuthor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PullReuest_repo_url_status_authorId_idx" ON "PullReuest"("repo_url", "status", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Reviewer_pull_requestId_key" ON "Reviewer"("pull_requestId");

-- CreateIndex
CREATE INDEX "Reviewer_pull_requestId_status_authorId_idx" ON "Reviewer"("pull_requestId", "status", "authorId");

-- CreateIndex
CREATE INDEX "BlacklistedAuthor_authorId_idx" ON "BlacklistedAuthor"("authorId");

-- AddForeignKey
ALTER TABLE "Reviewer" ADD CONSTRAINT "Reviewer_pull_requestId_fkey" FOREIGN KEY ("pull_requestId") REFERENCES "PullReuest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
