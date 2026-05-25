const app = require('./app');
const { connectDatabase } = require('./config/database');
const { env } = require('./config/env');

const startServer = async () => {
  console.log('Starting server...');
  console.log('NODE_ENV:', env.nodeEnv);
  console.log('PORT:', env.port);
  console.log('Connecting to database...');

  await connectDatabase();

  console.log('Database connected successfully');

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
