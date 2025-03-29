import app from './app';
import { query } from './config/database';

const PORT = process.env.PORT || 5000;

// Test database connection
query('SELECT NOW()')
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed', err);
    process.exit(1);
  });