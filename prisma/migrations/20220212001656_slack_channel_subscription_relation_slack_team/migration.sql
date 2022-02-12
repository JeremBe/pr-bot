-- AddForeignKey
ALTER TABLE "SlackChannelSubscription" ADD CONSTRAINT "SlackChannelSubscription_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "SlackTeam"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;
