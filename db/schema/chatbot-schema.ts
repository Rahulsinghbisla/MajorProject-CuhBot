import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { user } from "./auth-schema"; // Import your existing user table

export const threads = pgTable("threads", {
  id: text("id").primaryKey(), // The thread_id from LangGraph
  title: text("title").notNull(),
  
  // This establishes the Foreign Key relationship
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }), 
    
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => {
  return {
    // Indexing the foreign key is crucial for fast sidebar lookups
    userIdIdx: index("user_id_idx").on(table.userId),
  };
});