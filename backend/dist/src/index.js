import express from 'express';
import { config } from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import tourRoutes from './routes/tour.routes.js';
// Load environment variables
config();
const app = express();
const port = process.env.PORT || 9000;
// Middleware
app.use(express.json());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tours', tourRoutes);
// Basic health check route
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});
// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
