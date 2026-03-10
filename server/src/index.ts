import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';

const app: Express = express();
const PORT = process.env.PORT || 4000;

// === MIDDLEWARE ===
app.use(express.json());
app.use(cookieParser());

// CORS 配置（允许前端访问）
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true, // 允许 cookies
  })
);

// === ROUTES ===
app.use('/api/auth', authRoutes);

// === HEALTH CHECK ===
app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'Server is running' });
});

// === ERROR HANDLER ===
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`🚀 Auth server running on http://localhost:${PORT}`);
  console.log(`📧 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});