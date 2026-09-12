// Dev only: adds sample wishes for an existing user.
// Usage: npm run db:seed -- you@example.com
import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";

import { PrismaClient, type WishStatus } from "../lib/generated/prisma/client";

type Seed = {
  name: string;
  description?: string;
  category: "ELECTRONICS" | "CLOTHING" | "FITNESS" | "BOOKS" | "TRAVEL" | "EDUCATION" | "HOME" | "OTHER";
  priority: "LOW" | "MEDIUM" | "HIGH";
  price?: string;
  currency?: string;
  image?: string;
  daysAgo: number;
  status?: WishStatus;
  note?: string;
};

const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/600`;

const SEEDS: Seed[] = [
  { name: "Noise-cancelling headphones", description: "For the commute and long flights. Compare battery life first.", category: "ELECTRONICS", priority: "HIGH", price: "29990", image: img("headphones"), daysAgo: 45 },
  { name: "Learn to bake sourdough", description: "A weekend course, or just a good book and patience.", category: "EDUCATION", priority: "LOW", daysAgo: 3 },
  { name: "A deliberately very long wish name to test truncation behavio", description: "Four hundred characters of description to make sure the card clamps properly and never grows taller than its neighbours. ".repeat(4).slice(0, 400), category: "OTHER", priority: "MEDIUM", daysAgo: 12 },
  { name: "Weekend in Pondicherry", description: "Quiet streets, the beach, and not much of a plan.", category: "TRAVEL", priority: "MEDIUM", price: "18000", image: img("coast"), daysAgo: 20 },
  { name: "Standing desk", category: "HOME", priority: "MEDIUM", price: "32500.50", image: img("desk"), daysAgo: 70 },
  { name: "Trail running shoes", description: "Only if I keep running through the monsoon.", category: "FITNESS", priority: "HIGH", price: "129", currency: "USD", image: "https://example.invalid/broken.jpg", daysAgo: 0 },
  { name: "Kindle Paperwhite", category: "ELECTRONICS", priority: "MEDIUM", price: "14999", image: img("reader"), daysAgo: 90, status: "BOUGHT", note: "Reading every night now. Worth it." },
  { name: "Guitar lessons", category: "EDUCATION", priority: "LOW", price: "6000", daysAgo: 120, status: "COMPLETED", note: "Ten lessons in, I can play the songs I wanted to." },
  { name: "Smartwatch", category: "ELECTRONICS", priority: "LOW", price: "24999", image: img("watch"), daysAgo: 60, status: "REJECTED", note: "My phone already does everything I'd use it for." },
  { name: "Espresso machine", category: "HOME", priority: "MEDIUM", price: "45000", daysAgo: 40, status: "REJECTED" },
];

async function main() {
  if (process.env.NODE_ENV === "production") throw new Error("Refusing to seed in production");
  const email = process.argv[2];
  if (!email) throw new Error("Usage: npm run db:seed -- you@example.com");

  const db = new PrismaClient({
    adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
  });
  try {
    const user = await db.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) throw new Error(`No user with email ${email} - sign in once first`);

    for (const seed of SEEDS) {
      const createdAt = new Date(Date.now() - seed.daysAgo * 86_400_000);
      const status = seed.status ?? "PENDING";
      const decidedAt = new Date(createdAt.getTime() + Math.min(seed.daysAgo, 14) * 43_200_000);
      const history = [{ status: "PENDING" as const, createdAt }];
      if (status !== "PENDING") {
        history.push({ status, createdAt: decidedAt, ...(seed.note && { note: seed.note, noteUpdatedAt: decidedAt }) } as never);
      }

      await db.wish.create({
        data: {
          userId: user.id,
          name: seed.name,
          description: seed.description,
          category: seed.category,
          priority: seed.priority,
          estimatedPrice: seed.price,
          currency: seed.currency ?? "INR",
          images: seed.image ? [seed.image] : [],
          status,
          fulfilledOn: status === "BOUGHT" || status === "COMPLETED" ? decidedAt : null,
          createdAt,
          updatedAt: status === "PENDING" ? createdAt : decidedAt,
          statusChanges: { create: history },
        },
      });
    }
    console.log(`Seeded ${SEEDS.length} wishes for ${email}`);
  } finally {
    await db.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
