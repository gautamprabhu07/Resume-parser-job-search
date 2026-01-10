// src/app.js

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import jobsRouter from './routes/jobs.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JOOBLE_API_KEY = process.env.JOOBLE_API_KEY;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';


app.use((req, res, next) => {
  req.requestId = crypto.randomUUID();
  next();
});

// Startup safety: require API key
if (!JOOBLE_API_KEY) {
  console.error('❌ JOOBLE_API_KEY not set');
  process.exit(1);
}

// Middleware
app.use(express.json());

// CORS: restrict to your frontend origin
app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);


// Rate limiting: protect against abuse
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per IP per minute
});
app.use(limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Jobs route
app.use('/jobs', jobsRouter);

// Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Job Finder API running at http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully.');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received (Ctrl+C). Shutting down gracefully.');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

