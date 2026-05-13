const app = require('./app');
const config = require('./config');
const connectDB = require('./config/db');

const PORT = config.port;
const NODE_ENV = config.env;


const startServer = async () => {
  try {
    // Connect to database before starting the server
    await connectDB();

    app.listen(PORT, () => {
      console.log(`
       Knightly Backend is running!
      ---------------------------------
      Port:    ${PORT}
      Mode:    ${NODE_ENV}
      Health:  http://localhost:${PORT}/api/v1/health
      ---------------------------------
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!  Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
