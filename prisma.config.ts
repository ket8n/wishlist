import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Only migrate/introspect commands need this; `prisma generate` does not.
    url: process.env.DATABASE_URL ?? "",
  },
});
