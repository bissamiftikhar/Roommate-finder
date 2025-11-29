import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';
import * as db from '../services/database.js';

const router = Router();

const ProfileSchema = z.object({
  age: z.number().int().min(18).max(100),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
  personal_email: z.string().email().optional(),
  bio: z.string().max(500).optional(),
  phone: z.string().optional(),
});

const BasicPreferenceSchema = z.object({
  gender_preference: z.enum(['any', 'male', 'female', 'other']),
  age_min: z.number().int().min(18),
  age_max: z.number().int().max(100),
  budget_min: z.number().nonnegative(),
  budget_max: z.number().nonnegative(),
  location_preference: z.string().optional(),
});

const LifestylePreferenceSchema = z.object({
  sleep_schedule: z.enum(['early_bird', 'normal', 'night_owl', 'flexible']),
  cleanliness: z.enum(['very_clean', 'moderate', 'relaxed']),
  guest_policy: z.enum(['never', 'rarely', 'sometimes', 'often']),
  smoking: z.boolean(),
  pets: z.boolean(),
  noise_tolerance: z.enum(['quiet', 'moderate', 'loud']),
  study_habits: z.enum(['library', 'home', 'flexible']),
});

/**
 * GET /profile
 * Get current user's profile
 */
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const profile = await db.getProfileByStudentId(req.user.student_id);
    const basicPreference = await db.getBasicPreferenceByStudentId(req.user.student_id);
    const lifestylePreference = await db.getLifestylePreferenceByStudentId(req.user.student_id);

    res.json({
      profile,
      basicPreference,
      lifestylePreference,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /profile
 * Update current user's profile
 */
router.put('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const data = ProfileSchema.parse(req.body);
    const profile = await db.createOrUpdateProfile(req.user.student_id, data);

    res.json(profile);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /profile/preferences/basic
 * Get basic preferences
 */
router.get('/preferences/basic', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const preference = await db.getBasicPreferenceByStudentId(req.user.student_id);
    res.json(preference || {});
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /profile/preferences/basic
 * Update basic preferences
 */
router.put('/preferences/basic', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const data = BasicPreferenceSchema.parse(req.body);
    const preference = await db.createOrUpdateBasicPreference(req.user.student_id, data);

    res.json(preference);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /profile/preferences/lifestyle
 * Get lifestyle preferences
 */
router.get(
  '/preferences/lifestyle',
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const preference = await db.getLifestylePreferenceByStudentId(req.user.student_id);
      res.json(preference || {});
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * PUT /profile/preferences/lifestyle
 * Update lifestyle preferences
 */
router.put(
  '/preferences/lifestyle',
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const data = LifestylePreferenceSchema.parse(req.body);
      const preference = await db.createOrUpdateLifestylePreference(req.user.student_id, data);

      res.json(preference);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * POST /profile/block/:userId
 * Block a user
 */
router.post('/block/:userId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { userId } = req.params;

    if (userId === req.user.student_id) {
      return res.status(400).json({ error: 'Cannot block yourself' });
    }

    const block = await db.blockUser(req.user.student_id, userId);
    res.status(201).json(block);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /profile/block/:userId
 * Unblock a user
 */
router.delete('/block/:userId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { userId } = req.params;
    await db.unblockUser(req.user.student_id, userId);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /profile/report
 * Report a user
 */
router.post('/report', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { reported_id, reason } = req.body;

    if (!reported_id || !reason) {
      return res.status(400).json({ error: 'reported_id and reason are required' });
    }

    if (reported_id === req.user.student_id) {
      return res.status(400).json({ error: 'Cannot report yourself' });
    }

    const report = await db.createReport(req.user.student_id, reported_id, reason);
    res.status(201).json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
