/*
  Warnings:

  - A unique constraint covering the columns `[channelId,repo_url]` on the table `SlackChannelSubscription` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "SlackChannelSubscription_channelId_key";

-- CreateIndex
CREATE UNIQUE INDEX "SlackChannelSubscription_channelId_repo_url_key" ON "SlackChannelSubscription"("channelId", "repo_url");
