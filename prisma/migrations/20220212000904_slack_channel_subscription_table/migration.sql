-- CreateTable
CREATE TABLE "SlackChannelSubscription" (
    "channelId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "repo_url" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SlackChannelSubscription_channelId_key" ON "SlackChannelSubscription"("channelId");
