/*
  Warnings:

  - Added the required column `categoryId` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Ingredient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserIngredient" DROP CONSTRAINT "UserIngredient_ingredientId_fkey";

-- DropIndex
DROP INDEX "Ingredient_name_key";

-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "expiryDate" TIMESTAMP(3),
ADD COLUMN     "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "quantity" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Ingredient_userId_idx" ON "Ingredient"("userId");

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
