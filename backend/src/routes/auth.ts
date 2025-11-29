import { Router, Response, Request } from 'express';
import { z } from 'zod';
import { AuthRequest, generateToken, authenticateToken } from '../middleware/auth.js';
import * as db from '../services/database.js';
import * as authService from '../services/auth.js';
import { supabase } from '../services/supabase.js';

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
 * Login with email and password (supports both student and admin)
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);

    // Try to find as student first
    let student = await db.getStudentByEmail(email);
    if (student) {
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
        role: 'student',
      });
      return;
    }

    // Try to find as admin
    const { data: adminData, error: adminError } = await supabase
      .from('admin')
      .select('*')
      .eq('admin_email', email)
      .single();

    if (adminData) {
      const passwordMatch = await authService.comparePassword(password, adminData.password_hash);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate token for admin (use admin_id)
      const token = generateToken(adminData.admin_id, adminData.admin_email);

      res.json({
        access_token: token,
        user: { admin_id: adminData.admin_id, admin_email: adminData.admin_email },
        role: 'admin',
      });
      return;
    }

    // No user found
    return res.status(401).json({ error: 'Invalid email or password' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    res.status(500).json({ error: error.message || 'Login failed' });
  }
});

/**
 * GET /auth/me
 * Get current user info (supports both student and admin)
 */
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Try to find as student first
    const student = await db.getStudentById(req.user.student_id);
    if (student) {
      const profile = await db.getProfileByStudentId(student.student_id);
      return res.json({
        user: student,
        profile,
        role: 'student',
      });
    }

    // Try to find as admin
    const { data: admin } = await supabase
      .from('admin')
      .select('*')
      .eq('admin_email', req.user.student_email)
      .single();

    if (admin) {
      return res.json({
        user: { admin_id: admin.admin_id, admin_email: admin.admin_email },
        role: 'admin',
      });
    }

    return res.status(404).json({ error: 'User not found' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
