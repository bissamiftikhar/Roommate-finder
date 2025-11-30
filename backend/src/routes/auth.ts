import { Router, Response, Request } from 'express';
import { z } from 'zod';
import { AuthRequest, generateToken, generateAdminToken, authenticateToken } from '../middleware/auth.js';
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
    console.log('Register attempt with:', req.body);
    const { email, password } = RegisterSchema.parse(req.body);

    // Check if email already exists
    const existing = await db.getStudentByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password and create student
    const passwordHash = await authService.hashPassword(password);
    console.log('Password hash created');
    const student = await db.createStudent(email, passwordHash);
    console.log('Student created:', student);

    // Notify all admins about new registration
    console.log('Calling notifyAllAdmins for new registration');
    await db.notifyAllAdmins(
      'system',
      `New student registered: ${email.split('@')[0]} (${email})`
    );
    console.log('notifyAllAdmins completed');

    // Generate token
    const token = generateToken(student.student_id, student.student_email);

    res.status(201).json({
      access_token: token,
      user: student,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
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
    console.log('Login attempt with:', req.body.email);
    const { email, password } = LoginSchema.parse(req.body);

    // Try to find as admin first (priority)
    const { data: adminData } = await supabase
      .from('admin')
      .select('*')
      .eq('admin_email', email)
      .single();

    if (adminData) {
      const passwordMatch = await authService.comparePassword(password, adminData.password_hash);
      if (passwordMatch) {
        // Generate token for admin (use admin_id)
        const token = generateAdminToken(adminData.admin_id, adminData.admin_email);

        res.json({
          access_token: token,
          user: { admin_id: adminData.admin_id, admin_email: adminData.admin_email, role: 'admin' },
        });
        return;
      }
    }

    // Try to find as student
    let student = await db.getStudentByEmail(email);
    if (student) {
      const passwordMatch = await authService.comparePassword(password, student.password_hash);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Check if account is suspended
      if (student.status === 'suspended') {
        return res.status(403).json({ error: 'Your account has been suspended. Please contact support for assistance.' });
      }

      // Check if account is inactive
      if (student.status === 'inactive') {
        return res.status(403).json({ error: 'Your account is inactive. Please contact support to reactivate.' });
      }

      // Update last login
      await db.updateStudentLastLogin(student.student_id);

      // Get profile
      const profile = await db.getProfileByStudentId(student.student_id);

      // Generate token
      const token = generateToken(student.student_id, student.student_email);

      res.json({
        access_token: token,
        user: { ...student, role: 'student' },
        profile,
      });
      return;
    }

    // No user found
    return res.status(401).json({ error: 'Invalid email or password' });
  } catch (error: any) {
    console.error('Login error:', error);
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

    // Check if it's an admin first (admin_id in token)
    if (req.user.admin_id) {
      const { data: admin } = await supabase
        .from('admin')
        .select('*')
        .eq('admin_id', req.user.admin_id)
        .single();

      if (admin) {
        return res.json({
          user: { admin_id: admin.admin_id, admin_email: admin.admin_email, role: 'admin' },
        });
      }
    }

    // Try to find as student
    if (req.user.student_id) {
      const student = await db.getStudentById(req.user.student_id);
      if (student) {
        const profile = await db.getProfileByStudentId(student.student_id);
        return res.json({
          user: { ...student, role: 'student' },
          profile,
        });
      }
    }

    // Fallback: try to find by email
    const { data: admin } = await supabase
      .from('admin')
      .select('*')
      .eq('admin_email', req.user.student_email)
      .single();

    if (admin) {
      return res.json({
        user: { admin_id: admin.admin_id, admin_email: admin.admin_email, role: 'admin' },
      });
    }

    return res.status(404).json({ error: 'User not found' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /auth/create-admin
 * Create a new admin account (admin use only)
 */
router.post('/create-admin', async (req: Request, res: Response) => {
  try {
    const { email, password } = RegisterSchema.parse(req.body);

    // Check if admin email already exists
    const existing = await supabase
      .from('admin')
      .select('*')
      .eq('admin_email', email)
      .single();
    
    if (existing.data) {
      return res.status(400).json({ error: 'Admin email already exists' });
    }

    // Hash password and create admin
    const passwordHash = await authService.hashPassword(password);
    const adminResult = await supabase
      .from('admin')
      .insert({
        admin_email: email,
        password_hash: passwordHash,
      })
      .select()
      .single();

    if (adminResult.error) throw adminResult.error;

    // Generate token for admin
    const token = generateAdminToken(adminResult.data.admin_id, adminResult.data.admin_email);

    res.status(201).json({
      access_token: token,
      user: { admin_id: adminResult.data.admin_id, admin_email: adminResult.data.admin_email, role: 'admin' },
    });
  } catch (error: any) {
    console.error('Admin creation error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    res.status(500).json({ error: error.message || 'Admin creation failed' });
  }
});

export default router;
