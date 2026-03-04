-- Add performance indexes for common query patterns

-- MeowMedal: queries group/filter by category
CREATE INDEX "MeowMedal_category_idx" ON "MeowMedal"("category");

-- ChatMessage: per-user message lookups (admin panel, moderation)
CREATE INDEX "ChatMessage_userId_idx" ON "ChatMessage"("userId");
