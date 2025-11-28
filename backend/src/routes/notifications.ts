import { Router, Request, Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';
import * as db from '../services/database.js';

const router = Router();

/**
 * GET /notifications
 * Get notifications for current user
 */
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const notifications = await db.getNotificationsForStudent(req.user.student_id);
    res.json(notifications);
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
