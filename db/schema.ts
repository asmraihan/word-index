import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const wordTable = sqliteTable("words", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull(),
  word: text("word").notNull(),
  translation: text("translation").notNull(),
  sentence: text("sentence").notNull(),
  category: text("category").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const WordSchema= createSelectSchema(wordTable);
export type word = z.infer<typeof WordSchema>;
