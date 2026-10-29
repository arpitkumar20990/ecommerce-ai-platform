-- CreateEnum
CREATE TYPE "SellerStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "seller" (
    "id" TEXT NOT NULL,
    "authUserId" TEXT NOT NULL,
    "storeName" TEXT NOT NULL,
    "description" TEXT,
    "status" "SellerStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seller_authUserId_key" ON "seller"("authUserId");

-- CreateIndex
CREATE UNIQUE INDEX "seller_storeName_key" ON "seller"("storeName");
