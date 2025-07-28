import Database from 'better-sqlite3';

const db = new Database('mountain-explorer.db', { verbose: console.log });

export default db;