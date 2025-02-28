import { nanoid } from "nanoid";
import {
  index,
  pgTable,
  text,
  varchar,
  vector,
  bigint,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
// import { resources } from './resources';

// export const embeddings = pgTable(
//     'embeddings',
//     {
//         id: varchar('id', { length: 191 })
//             .primaryKey()
//             .$defaultFn(() => nanoid()),
//         resourceId: varchar('resource_id', { length: 191 })
//         // .references(
//         // () => resources.id,
//         // { onDelete: 'cascade' },
//         // ),
//         ,
//         content: text('content').notNull(),
//         embedding: vector('embedding', { dimensions: 1536 }).notNull(),
//     },
//     table => ({
//         embeddingIndex: index('embeddingIndex').using(
//             'hnsw',
//             table.embedding.op('vector_cosine_ops'),
//         ),
//     }),
// );

export const receipts = pgTable(
  "receipts",
  {
    id: bigint("id", { mode: "bigint" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    userId: bigint("user_id", { mode: "bigint" }).notNull(),
    imageId: bigint("image_id", { mode: "bigint" }).notNull(),
    // .references(() => expenseImages.id, { onDelete: 'cascade' }),
    chunk_text: text("chunk_text").notNull(),
    shopName: text("shop_name").notNull(),
    total: bigint("total", { mode: "number" }).notNull(),
    transactionDate: varchar("transaction_date", { length: 255 }).notNull(),
    metadata: jsonb("metadata").notNull().default({}),
    embedding: vector("embedding", { dimensions: 1536 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  ]
);
