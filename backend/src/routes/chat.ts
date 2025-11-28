import { Router, Request, Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';
import * as db from '../services/database.js';

const router = Router();

/**
 * GET /chat/:matchId
 * Get messages for a match
 */
router.get('/:matchId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { matchId } = (req as any).params;
    const messages = await db.getMessagesForMatch(matchId);

    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /chat/:matchId
 * Send a message in a match
 */
router.post('/:matchId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { matchId } = (req as any).params;
    const { content } = (req as any).body;

    if (!content) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const message = await db.sendMessage(matchId, req.user.student_id, content);

    // Find the other user in the match and send notification
    const match = await db.getMatchById(matchId);
    if (match) {
      const otherUserId = match.student1_id === req.user.student_id 
        ? match.student2_id 
        : match.student1_id;
      
      await db.createNotification(
        otherUserId,
        'message',
        'You have a new message'
      );
    }

    res.status(201).json(message);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /chat/message/:messageId/read
 * Mark message as read
 */
router.put(
  '/message/:messageId/read',
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { messageId } = (req as any).params;
      await db.markMessageAsRead(messageId);

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
