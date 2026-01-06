import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.test for e2e tests
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });
