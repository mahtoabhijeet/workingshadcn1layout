import { buildConfig } from 'payload';
import path from 'path';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import Users from './src/collections/Users';

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-here',
  admin: {
    user: 'users',
  },
  collections: [
    Users,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./payload.db',
    },
  }),
});
