import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../prisma';
import { sendVerificationEmail } from '../mail';
import { signToken, verifyToken } from '../jwt';

const router = express.Router();

// === REGISTER ===
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // 2. Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Generate verification token
    const verificationToken = uuidv4();
    const tokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    // 5. Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        verificationToken,
        tokenExpiresAt,
        isVerified: false,
      },
    });

    // 6. Send verification email (fire and forget)
    sendVerificationEmail(email, verificationToken).catch((err) => {
      console.error('Email sending failed:', err);
    });

    return res.status(201).json({
      ok: true,
      message: 'Registration successful. Check your email to verify.',
      userId: user.id,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// === VERIFY EMAIL ===
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // 1. Find user by verification token
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    // 2. Check if token is expired
    if (user.tokenExpiresAt && user.tokenExpiresAt < new Date()) {
      return res.status(400).json({ error: 'Verification token has expired' });
    }

    // 3. Mark user as verified and clear token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        tokenExpiresAt: null,
      },
    });

    return res.json({ ok: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// === LOGIN ===
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // 2. Find user
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.hashedPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 3. Check if verified
    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email first' });
    }

    // 4. Compare password
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 5. Generate JWT token
    const token = signToken({ sub: user.id, email: user.email });

    // 6. Set secure cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return res.json({
      ok: true,
      message: 'Login successful',
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// === LOGOUT ===
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token', { path: '/' });
  return res.json({ ok: true, message: 'Logged out successfully' });
});

// === GET CURRENT USER (optional, for checking session) ===
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, isVerified: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ ok: true, user });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;