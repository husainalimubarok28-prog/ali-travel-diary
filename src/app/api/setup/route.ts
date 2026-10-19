import { NextResponse } from "next/server";
import { createClient, Client } from "@libsql/client";

export const dynamic = "force-dynamic";

function getClient(): Client {
  return createClient({
    url: process.env.TURSO_DATABASE_URL || "file:./prisma/dev.db",
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  });
}

const TABLES = [
  `CREATE TABLE "User" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "BlogPost" (
    "id" TEXT PRIMARY KEY,
    "slug" TEXT UNIQUE NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "category" TEXT NOT NULL DEFAULT 'travel-story',
    "authorId" TEXT NOT NULL,
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readingTime" INTEGER NOT NULL DEFAULT 5,
    "tags" TEXT NOT NULL DEFAULT '',
    "featured" BOOLEAN NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS "JournalEntry" (
    "id" TEXT PRIMARY KEY,
    "slug" TEXT UNIQUE NOT NULL,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "weather" TEXT,
    "temperature" REAL,
    "mood" TEXT,
    "images" TEXT NOT NULL DEFAULT '',
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "GalleryItem" (
    "id" TEXT PRIMARY KEY,
    "src" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "caption" TEXT,
    "category" TEXT NOT NULL DEFAULT 'street',
    "country" TEXT,
    "city" TEXT,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "CountryData" (
    "id" TEXT PRIMARY KEY,
    "slug" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "nameId" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "continent" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "heroImage" TEXT,
    "visited" TEXT,
    "duration" TEXT,
    "budget" REAL NOT NULL DEFAULT 0,
    "story" TEXT,
    "content" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "coordinates" TEXT NOT NULL DEFAULT '[]',
    "video" TEXT NOT NULL DEFAULT '',
    "transport" TEXT NOT NULL DEFAULT '[]',
    "visa" TEXT NOT NULL DEFAULT '',
    "visaCost" REAL NOT NULL DEFAULT 0,
    "documents" TEXT NOT NULL DEFAULT '[]',
    "tips" TEXT NOT NULL DEFAULT '[]',
    "budgetBreakdown" TEXT NOT NULL DEFAULT '[]',
    "food" TEXT NOT NULL DEFAULT '[]',
    "accommodation" TEXT NOT NULL DEFAULT '[]',
    "internet" TEXT NOT NULL DEFAULT '',
    "simCard" TEXT NOT NULL DEFAULT '',
    "money" TEXT NOT NULL DEFAULT '',
    "safety" TEXT NOT NULL DEFAULT '',
    "mosque" TEXT NOT NULL DEFAULT '[]',
    "halalFood" TEXT NOT NULL DEFAULT '',
    "bestExperience" TEXT NOT NULL DEFAULT '',
    "worstExperience" TEXT NOT NULL DEFAULT '',
    "travelTips" TEXT NOT NULL DEFAULT '[]',
    "mistakes" TEXT NOT NULL DEFAULT '[]',
    "hiddenGems" TEXT NOT NULL DEFAULT '[]',
    "ratings" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "Testimonial" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "avatar" TEXT,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "Video" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "platform" TEXT NOT NULL DEFAULT 'youtube',
    "thumbnail" TEXT,
    "country" TEXT NOT NULL,
    "duration" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "Subscriber" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT 1,
    "subscribedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "ContactMessage" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "SiteContent" (
    "id" TEXT PRIMARY KEY,
    "key" TEXT UNIQUE NOT NULL,
    "value" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "City" (
    "id" TEXT PRIMARY KEY,
    "slug" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "countrySlug" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "heroImage" TEXT,
    "budget" REAL NOT NULL DEFAULT 0,
    "duration" TEXT,
    "highlights" TEXT NOT NULL DEFAULT '',
    "coordinates" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
];

export async function GET() {
  const client = getClient();
  const results: string[] = [];

  try {
    for (const sql of TABLES) {
      const match = sql.match(/CREATE TABLE IF NOT EXISTS "(\w+)"/);
      const tableName = match ? match[1] : "unknown";
      try {
        // Drop and recreate to fix schema mismatches
        try { await client.execute(`DROP TABLE IF EXISTS "${tableName}"`); } catch (e) {}
        await client.execute(sql.replace('CREATE TABLE IF NOT EXISTS', 'CREATE TABLE'));
        results.push(`✓ ${tableName}`);
      } catch (e) {
        results.push(`✗ ${tableName}: ${String(e)}`);
      }
    }
    return NextResponse.json({ success: true, results });
  } catch (error) {
    return NextResponse.json({ error: String(error), results }, { status: 500 });
  }
}
