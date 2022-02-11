-- CreateEnum
CREATE TYPE "Status" AS ENUM ('approved', 'changes_requested', 'commented', 'review_requested');

-- CreateTable
CREATE TABLE "PullRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "repo" TEXT NOT NULL,
    "repo_url" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PullRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "pull_requestId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlacklistedAuthor" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlacklistedAuthor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlackUser" (
    "slackId" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "SlackTeam" (
    "secret" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PullRequest_url_key" ON "PullRequest"("url");

-- CreateIndex
CREATE INDEX "PullRequest_repo_url_status_authorId_idx" ON "PullRequest"("repo_url", "status", "authorId");

-- CreateIndex
CREATE INDEX "Review_pull_requestId_status_authorId_idx" ON "Review"("pull_requestId", "status", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_authorId_pull_requestId_key" ON "Review"("authorId", "pull_requestId");

-- CreateIndex
CREATE INDEX "BlacklistedAuthor_authorId_idx" ON "BlacklistedAuthor"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "SlackUser_slackId_key" ON "SlackUser"("slackId");

-- CreateIndex
CREATE INDEX "SlackUser_authorId_idx" ON "SlackUser"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "SlackUser_teamId_authorId_key" ON "SlackUser"("teamId", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "SlackTeam_secret_key" ON "SlackTeam"("secret");

-- CreateIndex
CREATE UNIQUE INDEX "SlackTeam_teamId_key" ON "SlackTeam"("teamId");

-- AddForeignKey
ALTER TABLE "PullRequest" ADD CONSTRAINT "PullRequest_authorId_teamId_fkey" FOREIGN KEY ("authorId", "teamId") REFERENCES "SlackUser"("authorId", "teamId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_teamId_fkey" FOREIGN KEY ("authorId", "teamId") REFERENCES "SlackUser"("authorId", "teamId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_pull_requestId_fkey" FOREIGN KEY ("pull_requestId") REFERENCES "PullRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlackUser" ADD CONSTRAINT "SlackUser_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "SlackTeam"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;
