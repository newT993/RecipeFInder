/*
  Warnings:

  - You are about to drop the column `title` on the `Recipe` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_userId_fkey";

-- DropIndex
DROP INDEX "Ingredient_userId_idx";

-- AlterTable
ALTER TABLE "Ingredient" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "title",
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
