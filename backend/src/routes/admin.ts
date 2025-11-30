import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';
import * as db from '../services/database.js';
import { supabase } from '../services/supabase.js';

const router = Router();

/**
 * Middleware to verify admin role
 */
const requireAdmin = async (req: AuthRequest, res: Response, next: Function) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Check if user is admin by looking up in admin table
    const { data: admin } = await supabase
      .from('admin')
      .select('*')
      .eq('admin_email', req.user.student_email)
      .single();

    if (!admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    (req as any).admin = admin;
    next();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /admin/reports
 * Get all reports (optionally filter by status)
 */
router.get('/reports', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const reports = await db.getReports(status);

    // Fetch reporter and reported user details including student info
    const reportsWithDetails = await Promise.all(
      reports.map(async (report) => {
        const reporterProfile = report.reporter_id 
          ? await db.getProfileByStudentId(report.reporter_id)
          : null;
        const reporterStudent = report.reporter_id
          ? await db.getStudentById(report.reporter_id)
          : null;
        
        const reportedProfile = await db.getProfileByStudentId(report.reported_id);
        const reportedStudent = await db.getStudentById(report.reported_id);
        
        return { 
          ...report, 
          reporter: reporterProfile ? { ...reporterProfile, student: reporterStudent } : null,
          reported: reportedProfile ? { ...reportedProfile, student: reportedStudent } : null
        };
      })
    );

    res.json(reportsWithDetails);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /admin/reports/:reportId
 * Update report status and add admin notes
 */
router.put('/reports/:reportId', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { reportId } = req.params;
    const { status, admin_notes } = req.body;

    if (!['pending', 'under_review', 'resolved', 'dismissed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updated = await db.updateReportStatus(reportId, status, admin_notes);

    // Notify the reporter based on status
    if (updated.reporter_id) {
      if (status === 'resolved') {
        await db.createNotification(
          updated.reporter_id,
          'report_update',
          'Your report has been resolved by an administrator. Thank you for helping keep our community safe.'
        );
      } else if (status === 'dismissed') {
        await db.createNotification(
          updated.reporter_id,
          'report_update',
          'Your report has been reviewed. After investigation, no action was required at this time.'
        );
      } else if (status === 'under_review') {
        await db.createNotification(
          updated.reporter_id,
          'report_update',
          'Your report is currently under review by our admin team.'
        );
      }
    }

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /admin/users
 * Get all users with their profiles
 */
router.get('/users', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { data: students, error } = await supabase
      .from('student')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Fetch profiles for each student
    const usersWithProfiles = await Promise.all(
      (students || []).map(async (student) => {
        const profile = await db.getProfileByStudentId(student.student_id);
        return { ...student, profile };
      })
    );

    res.json(usersWithProfiles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /admin/users/:userId/status
 * Update user status (active, inactive, suspended)
 */
router.put('/users/:userId/status', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data, error } = await supabase
      .from('student')
      .update({ status })
      .eq('student_id', userId)
      .select()
      .single();

    if (error) throw error;

    // Notify user if suspended
    if (status === 'suspended') {
      await db.createNotification(
        userId,
        'system',
        'Your account has been suspended. Please contact support for more information.'
      );
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /admin/stats
 * Get dashboard statistics
 */
router.get('/stats', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    // Get counts for various entities
    const [
      studentsResult,
      matchesResult,
      reportsResult,
      messagesResult,
    ] = await Promise.all([
      supabase.from('student').select('*', { count: 'exact', head: true }),
      supabase.from('match').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('report').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('message').select('*', { count: 'exact', head: true }),
    ]);

    res.json({
      totalUsers: studentsResult.count || 0,
      activeMatches: matchesResult.count || 0,
      pendingReports: reportsResult.count || 0,
      totalMessages: messagesResult.count || 0,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /admin/test-notification
 * Create a test notification for all admins (for testing purposes)
 */
router.post('/test-notification', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    console.log('Test notification called by user:', req.user);
    await db.notifyAllAdmins('system', 'TEST: This is a test notification from the system');
    res.json({ success: true, message: 'Test notification created' });
  } catch (error: any) {
    console.error('Test notification error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /admin/users/:userId
 * Permanently delete a user and all their data
 */
router.delete('/users/:userId', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    // Delete user (cascade will handle related records)
    const { error } = await supabase
      .from('student')
      .delete()
      .eq('student_id', userId);

    if (error) throw error;

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
