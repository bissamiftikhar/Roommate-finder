import { Router, Request, Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';
import * as db from '../services/database.js';

const router = Router();

/**
 * GET /notifications
 * Get notifications for current user (student or admin)
 */
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    console.log('📬 Getting notifications for user:', req.user);
    // For admins, use admin_id; for students, use student_id
    const userId = req.user.admin_id || req.user.student_id;
    console.log('📬 Resolved userId:', userId, '(admin_id:', req.user.admin_id, ', student_id:', req.user.student_id, ')');
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID not found' });
    }
    
    const notifications = await db.getNotificationsForStudent(userId);
    console.log('📬 Found notifications:', notifications.length);
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /notifications/test-self
 * Create a test notification for the currently authenticated user
 */
router.post('/test-self', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const userId = req.user.admin_id || req.user.student_id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID not found in token' });
    }

    console.log('🔔 Creating self-test notification for userId:', userId);
    const { data, error } = await db.supabase
      .from('notification')
      .insert([{ student_id: userId, type: 'system', content: 'TEST: Self notification' }])
      .select();

    if (error) {
      console.error('Error inserting self-test notification:', error);
      return res.status(500).json({ error: 'Failed to create notification' });
    }

    res.json({ success: true, created: data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /notifications/:notificationId/read
 * Mark notification as read
 */
router.put(
  '/:notificationId/read',
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { notificationId } = (req as any).params;
      await db.markNotificationAsRead(notificationId);

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
