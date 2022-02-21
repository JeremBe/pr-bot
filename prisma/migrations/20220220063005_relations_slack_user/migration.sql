-- AlterTable
ALTER TABLE "PullRequest" ADD COLUMN     "slackUserId" TEXT;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "slackUserId" TEXT;

-- AddForeignKey
ALTER TABLE "PullRequest" ADD CONSTRAINT "PullRequest_slackUserId_fkey" FOREIGN KEY ("slackUserId") REFERENCES "SlackUser"("slackId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_slackUserId_fkey" FOREIGN KEY ("slackUserId") REFERENCES "SlackUser"("slackId") ON DELETE SET NULL ON UPDATE CASCADE;
