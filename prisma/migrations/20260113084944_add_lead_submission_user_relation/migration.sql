-- CreateIndex
CREATE INDEX "LeadSubmission_postId_idx" ON "LeadSubmission"("postId");

-- CreateIndex
CREATE INDEX "LeadSubmission_userId_idx" ON "LeadSubmission"("userId");

-- AddForeignKey
ALTER TABLE "LeadSubmission" ADD CONSTRAINT "LeadSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
