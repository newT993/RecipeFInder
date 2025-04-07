-- CreateTable
CREATE TABLE "SavedItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SavedItem" ADD CONSTRAINT "SavedItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedItem" ADD CONSTRAINT "SavedItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
