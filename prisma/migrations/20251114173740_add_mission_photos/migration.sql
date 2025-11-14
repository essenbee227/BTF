-- CreateTable
CREATE TABLE "MissionPhoto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "missionId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageHash" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "aiAnalysis" TEXT,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT NOT NULL,
    CONSTRAINT "MissionPhoto_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MissionPhoto_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "MissionPhoto_imageHash_idx" ON "MissionPhoto"("imageHash");

-- CreateIndex
CREATE INDEX "MissionPhoto_missionId_idx" ON "MissionPhoto"("missionId");
