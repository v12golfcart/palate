import { Database } from 'bun:sqlite'
import path from 'path'
import fs from 'fs'

const dbDir = path.resolve(import.meta.dir, '../../data')
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const db = new Database(path.join(dbDir, 'palate.db'))

db.run('PRAGMA journal_mode = WAL')
db.run('PRAGMA foreign_keys = ON')

const schemaPath = path.resolve(import.meta.dir, 'schema.sql')
const schema = fs.readFileSync(schemaPath, 'utf-8')
db.run(schema)

console.log('Database initialized at data/palate.db')

export default db
