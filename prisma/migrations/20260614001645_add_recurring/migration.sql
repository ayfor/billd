-- CreateTable
CREATE TABLE "RecurringTemplate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "frequency" TEXT NOT NULL,
    "anchorDay" INTEGER NOT NULL,
    "startDate" DATE NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecurringTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostingLedger" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "scheduledDate" DATE NOT NULL,
    "expenseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostingLedger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RecurringTemplate_userId_idx" ON "RecurringTemplate"("userId");

-- CreateIndex
CREATE INDEX "RecurringTemplate_categoryId_idx" ON "RecurringTemplate"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "PostingLedger_templateId_scheduledDate_key" ON "PostingLedger"("templateId", "scheduledDate");

-- AddForeignKey
ALTER TABLE "RecurringTemplate" ADD CONSTRAINT "RecurringTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringTemplate" ADD CONSTRAINT "RecurringTemplate_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostingLedger" ADD CONSTRAINT "PostingLedger_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "RecurringTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
