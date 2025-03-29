import express from 'express';
import cors from 'cors';
import routes from './routes';
import errorMiddleware from './middleware/error.middleware';
import 'express-async-errors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling middleware
app.use(errorMiddleware);

export default app;