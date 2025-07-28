import db from './db';
import fs from 'fs';
import path from 'path';

const schema = fs.readFileSync(path.resolve(process.cwd(), 'db-schema.sql'), 'utf8');

db.exec(schema);