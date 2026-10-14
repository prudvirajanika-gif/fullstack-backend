import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { seedInitialData } from './services/seedService.js';
import { ENV } from './config/env.js';

async function bootstrap() {
  const app = createApp();

  // Initialize DB and Seed Data
  await connectDB();
  await seedInitialData();

  app.listen(ENV.PORT, () => {
    console.log(`\n=================================================`);
    console.log(` CraveCraft REST API running on port ${ENV.PORT}`);
    console.log(` Health check: http://localhost:${ENV.PORT}/api/health`);
    console.log(` Foods API:    http://localhost:${ENV.PORT}/api/foods`);
    console.log(` Allowed CORS: ${ENV.FRONTEND_URL}`);
    console.log(`=================================================\n`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
