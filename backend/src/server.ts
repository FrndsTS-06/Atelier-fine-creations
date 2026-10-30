import { createApp } from './app.js';
import { ENV } from './config/env.js';
import { connectDatabase } from './config/database.js';

async function bootstrap() {
  await connectDatabase();
  const app = createApp();

  const server = app.listen(ENV.PORT, () => {
    console.log(`
      ⚜️ ======================================== ⚜️
         AURÉLIEN Haute Joaillerie REST Engine
         Running on: http://localhost:${ENV.PORT}
         Environment: ${ENV.NODE_ENV}
         Health Check: http://localhost:${ENV.PORT}/api/v1/health
      ⚜️ ======================================== ⚜️
    `);
  });

  // Graceful shutdown handling
  const shutdown = () => {
    console.log('\nClosing AURÉLIEN server gracefully...');
    server.close(() => {
      console.log('HTTP server terminated.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch((err) => {
  console.error('Fatal initialization error:', err);
  process.exit(1);
});
