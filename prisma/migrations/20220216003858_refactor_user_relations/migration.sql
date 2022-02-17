-- DropForeignKey
ALTER TABLE "PullRequest" DROP CONSTRAINT "PullRequest_authorId_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_authorId_teamId_fkey";
