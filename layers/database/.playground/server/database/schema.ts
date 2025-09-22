import { pgSchema, text, uuid, timestamp } from 'drizzle-orm/pg-core'

export const db_schema_app = pgSchema('app')

const base_schema_options = {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at_utc: timestamp({ mode: 'string', withTimezone: true }).defaultNow(),
  updated_at_utc: timestamp({ mode: 'string', withTimezone: true }).defaultNow(),
}

export const db_table_items = db_schema_app.table('items', {
  ...base_schema_options,
  name: text().notNull(),
})
