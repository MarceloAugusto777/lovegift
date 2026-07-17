-- CreateTable
CREATE TABLE "Gift" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "accessPassword" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "coupleName" TEXT NOT NULL,
    "specialDate" DATETIME NOT NULL,
    "message" TEXT NOT NULL,
    "locationUrl" TEXT,
    "locationName" TEXT,
    "musicUrl" TEXT,
    "dayCountStart" DATETIME NOT NULL,
    "photos" TEXT NOT NULL DEFAULT '[]',
    "loveQuotes" TEXT NOT NULL DEFAULT '[]',
    "accentColor" TEXT NOT NULL DEFAULT '#e11d48',
    "fontFamily" TEXT NOT NULL DEFAULT 'serif',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Gift_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "previewColor" TEXT NOT NULL DEFAULT '#e11d48',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Gift_slug_key" ON "Gift"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Template_name_key" ON "Template"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Template_slug_key" ON "Template"("slug");
