import { Router, Request, Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';
import * as db from '../services/database.js';
import * as matching from '../services/matching.js';

const router = Router();

/**
 * GET /matches/search
 * Find potential matches for current user
 */
router.get('/search', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const matches = await matching.findMatches(req.user.student_id, limit);

    res.json(matches);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /matches
 * Get confirmed matches for current user
 */
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    console.log('Fetching matches for student:', req.user.student_id);
    const matches = await db.getMatchesForStudent(req.user.student_id);
    console.log('Raw matches from DB:', matches);

    // Fetch details for each match
    const matchesWithDetails = await Promise.all(
      matches.map(async (match) => {
        const otherStudentId =
          match.student1_id === req.user!.student_id ? match.student2_id : match.student1_id;
        const profile = await db.getProfileByStudentId(otherStudentId);
        const student = await db.getStudentById(otherStudentId);
        
        const transformedMatch = {
          match_id: match.match_id,
          student1_id: match.student1_id,
          student2_id: match.student2_id,
          compatibility_score: match.compatibility_score,
          status: match.status,
          matched_at: match.matched_at,
          other_user_name: student?.student_email?.split('@')[0] || 'Unknown',
          other_user_bio: profile?.bio || '',
          other_user_profile_picture: undefined,
        };
        console.log('Transformed match:', transformedMatch);
        return transformedMatch;
      })
    );

    console.log('Final matches with details:', matchesWithDetails);
    res.json({ matches: matchesWithDetails });
  } catch (error: any) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /matches/requests
 * Get match requests for current user
 */
router.get('/requests', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    console.log('Fetching requests for student:', req.user.student_id);
    const requests = await db.getMatchRequestsForStudent(req.user.student_id);
    console.log('Raw requests from DB:', requests);

    // Fetch sender/receiver details with student info
    const requestsWithDetails = await Promise.all(
      requests.map(async (request) => {
        const senderProfile = await db.getProfileByStudentId(request.sender_id);
        const receiverProfile = await db.getProfileByStudentId(request.receiver_id);
        const senderStudent = await db.getStudentById(request.sender_id);
        const receiverStudent = await db.getStudentById(request.receiver_id);
        
        const result = { 
          ...request, 
          sender: { ...senderProfile, student_email: senderStudent?.student_email },
          receiver: { ...receiverProfile, student_email: receiverStudent?.student_email }
        };
        console.log('Request with details:', result);
        return result;
      })
    );

    console.log('Final requests with details:', requestsWithDetails);
    res.json(requestsWithDetails);
  } catch (error: any) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /matches/request
 * Send a match request
 */
router.post('/request', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { receiver_id, message } = req.body as any;

    if (!receiver_id) {
      return res.status(400).json({ error: 'receiver_id is required' });
    }

    // Check if blocked
    const isBlocked = await db.isUserBlocked(req.user.student_id, receiver_id);
    if (isBlocked) {
      return res.status(403).json({ error: 'You cannot send a request to this user' });
    }

    const request = await db.createMatchRequest(req.user.student_id, receiver_id, message);

    // Create notification
    await db.createNotification(
      receiver_id,
      'match_request',
      `${req.user.student_email} sent you a match request!`
    );

    res.status(201).json(request);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /matches/request/:requestId
 * Accept or reject a match request
 */
router.put('/request/:requestId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { requestId } = req.params;
    const { status } = req.body as any;

    if (!['accepted', 'rejected', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const request = await db.getMatchRequestById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Check authorization
    if (request.receiver_id !== req.user.student_id && request.sender_id !== req.user.student_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await db.updateMatchRequestStatus(requestId, status);

    // If accepted, create a match
    if (status === 'accepted') {
      const compatibilityScore = await (
        await import('../services/matching.js')
      ).calculateCompatibilityScore(request.sender_id, request.receiver_id);

      await db.createMatch(request.sender_id, request.receiver_id, compatibilityScore);

      // Create notifications
      await db.createNotification(
        request.sender_id,
        'match_request',
        'Your match request was accepted!'
      );
      await db.createNotification(
        request.receiver_id,
        'match_request',
        'You accepted a match request!'
      );
    }

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
