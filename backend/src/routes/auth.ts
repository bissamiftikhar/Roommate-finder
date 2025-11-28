import { Router, Response, Request } from 'express';
import { z } from 'zod';
import { AuthRequest, generateToken, authenticateToken } from '../middleware/auth.js';
import * as db from '../services/database.js';
import * as authService from '../services/auth.js';

const router = Router();

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

/**
 * POST /auth/register
 * Register a new student account
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = RegisterSchema.parse(req.body);

    // Check if email already exists
    const existing = await db.getStudentByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password and create student
    const passwordHash = await authService.hashPassword(password);
    const student = await db.createStudent(email, passwordHash);

    // Generate token
    const token = generateToken(student.student_id, student.student_email);

    res.status(201).json({
      access_token: token,
      user: student,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

/**
 * POST /auth/login
 * Login with email and password
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);

    const student = await db.getStudentByEmail(email);
    if (!student) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await authService.comparePassword(password, student.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await db.updateStudentLastLogin(student.student_id);

    // Get profile
    const profile = await db.getProfileByStudentId(student.student_id);

    // Generate token
    const token = generateToken(student.student_id, student.student_email);

    res.json({
      access_token: token,
      user: student,
      profile,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    res.status(500).json({ error: error.message || 'Login failed' });
  }
});

/**
 * GET /auth/me
 * Get current user info
 */
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const student = await db.getStudentById(req.user.student_id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const profile = await db.getProfileByStudentId(student.student_id);

    res.json({
      user: student,
      profile,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
