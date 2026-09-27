import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { config } from './config/env.js';
import './models/index.js';

async function start() {
  await connectDatabase();
  const app = createApp();
  app.listen(config.port, () => {
    console.log(`TaskFlow API listening on http://localhost:${config.port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
