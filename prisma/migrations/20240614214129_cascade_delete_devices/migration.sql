-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_firstUserId_fkey";

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_firstUserId_fkey" FOREIGN KEY ("firstUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
