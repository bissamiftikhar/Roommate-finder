import { supabase, supabaseAdmin } from './supabase.js';
import {
  Student,
  Profile,
  BasicPreference,
  LifestylePreference,
  MatchRequest,
  Match,
  Message,
  Notification,
  Report,
  Block,
} from '../types/index.js';

// ============ STUDENT OPERATIONS ============

export async function getStudentById(studentId: string): Promise<Student | null> {
  const { data, error } = await supabase
    .from('student')
    .select('*')
    .eq('student_id', studentId)
    .single();

  if (error) return null;
  return data;
}

export async function getStudentByEmail(email: string): Promise<Student | null> {
  const { data, error } = await supabase
    .from('student')
    .select('*')
    .eq('student_email', email)
    .single();

  if (error) return null;
  return data;
}

export async function createStudent(
  email: string,
  passwordHash: string
): Promise<Student> {
  const { data, error } = await supabase
    .from('student')
    .insert([
      {
        student_email: email,
        password_hash: passwordHash,
        status: 'active',
      },
    ])
    .select()
    .single();

  if (error) throw new Error(`Failed to create student: ${error.message}`);
  return data;
}

export async function updateStudentLastLogin(studentId: string): Promise<void> {
  await supabase
    .from('student')
    .update({ last_login: new Date().toISOString() })
    .eq('student_id', studentId);
}

// ============ PROFILE OPERATIONS ============

export async function getProfileByStudentId(studentId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .eq('student_id', studentId)
    .single();

  if (error) return null;
  return data;
}

export async function createOrUpdateProfile(
  studentId: string,
  profile: Partial<Profile>
): Promise<Profile> {
  const existing = await getProfileByStudentId(studentId);

  if (existing) {
    const { data, error } = await supabase
      .from('profile')
      .update(profile)
      .eq('student_id', studentId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update profile: ${error.message}`);
    return data;
  } else {
    const { data, error } = await supabase
      .from('profile')
      .insert([{ student_id: studentId, ...profile }])
      .select()
      .single();

    if (error) throw new Error(`Failed to create profile: ${error.message}`);
    return data;
  }
}

// ============ PREFERENCE OPERATIONS ============

export async function getBasicPreferenceByStudentId(
  studentId: string
): Promise<BasicPreference | null> {
  const { data, error } = await supabase
    .from('basic_preference')
    .select('*')
    .eq('student_id', studentId)
    .single();

  if (error) return null;
  return data;
}

export async function createOrUpdateBasicPreference(
  studentId: string,
  preference: Partial<BasicPreference>
): Promise<BasicPreference> {
  const existing = await getBasicPreferenceByStudentId(studentId);

  if (existing) {
    const { data, error } = await supabase
      .from('basic_preference')
      .update(preference)
      .eq('student_id', studentId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update basic preference: ${error.message}`);
    return data;
  } else {
    const { data, error } = await supabase
      .from('basic_preference')
      .insert([{ student_id: studentId, ...preference }])
      .select()
      .single();

    if (error) throw new Error(`Failed to create basic preference: ${error.message}`);
    return data;
  }
}

export async function getLifestylePreferenceByStudentId(
  studentId: string
): Promise<LifestylePreference | null> {
  const { data, error } = await supabase
    .from('lifestyle_preference')
    .select('*')
    .eq('student_id', studentId)
    .single();

  if (error) return null;
  return data;
}

export async function createOrUpdateLifestylePreference(
  studentId: string,
  preference: Partial<LifestylePreference>
): Promise<LifestylePreference> {
  const existing = await getLifestylePreferenceByStudentId(studentId);

  if (existing) {
    const { data, error } = await supabase
      .from('lifestyle_preference')
      .update(preference)
      .eq('student_id', studentId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update lifestyle preference: ${error.message}`);
    return data;
  } else {
    const { data, error } = await supabase
      .from('lifestyle_preference')
      .insert([{ student_id: studentId, ...preference }])
      .select()
      .single();

    if (error) throw new Error(`Failed to create lifestyle preference: ${error.message}`);
    return data;
  }
}

// ============ MATCH REQUEST OPERATIONS ============

export async function createMatchRequest(
  senderId: string,
  receiverId: string,
  message?: string
): Promise<MatchRequest> {
  const { data, error } = await supabase
    .from('match_request')
    .insert([
      {
        sender_id: senderId,
        receiver_id: receiverId,
        message,
        status: 'pending',
      },
    ])
    .select()
    .single();

  if (error) throw new Error(`Failed to create match request: ${error.message}`);
  return data;
}

export async function getMatchRequestById(requestId: string): Promise<MatchRequest | null> {
  const { data, error } = await supabase
    .from('match_request')
    .select('*')
    .eq('request_id', requestId)
    .single();

  if (error) return null;
  return data;
}

export async function getMatchRequestsForStudent(studentId: string): Promise<MatchRequest[]> {
  const { data, error } = await supabase
    .from('match_request')
    .select('*')
    .or(`sender_id.eq.${studentId},receiver_id.eq.${studentId}`)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function updateMatchRequestStatus(
  requestId: string,
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
): Promise<MatchRequest> {
  const { data, error } = await supabase
    .from('match_request')
    .update({ status })
    .eq('request_id', requestId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update match request: ${error.message}`);
  return data;
}

// ============ MATCH OPERATIONS ============

export async function getMatchById(matchId: string): Promise<Match | null> {
  const { data, error } = await supabase
    .from('match')
    .select('*')
    .eq('match_id', matchId)
    .single();

  if (error) return null;
  return data;
}

export async function getMatchesForStudent(studentId: string): Promise<Match[]> {
  const { data, error } = await supabase
    .from('match')
    .select('*')
    .or(`student1_id.eq.${studentId},student2_id.eq.${studentId}`)
    .eq('status', 'active')
    .order('matched_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function createMatch(
  student1Id: string,
  student2Id: string,
  compatibilityScore: number
): Promise<Match> {
  const [id1, id2] = student1Id < student2Id 
    ? [student1Id, student2Id] 
    : [student2Id, student1Id];

  const { data, error } = await supabase
    .from('match')
    .insert([
      {
        student1_id: id1,
        student2_id: id2,
        compatibility_score: compatibilityScore,
        status: 'active',
      },
    ])
    .select()
    .single();

  if (error) throw new Error(`Failed to create match: ${error.message}`);
  return data;
}

// ============ MESSAGE OPERATIONS ============

export async function sendMessage(
  matchId: string,
  senderId: string,
  content: string
): Promise<Message> {
  const { data, error } = await supabase
    .from('message')
    .insert([
      {
        match_id: matchId,
        sender_id: senderId,
        content,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(`Failed to send message: ${error.message}`);
  return data;
}

export async function getMessagesForMatch(matchId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('message')
    .select('*')
    .eq('match_id', matchId)
    .order('sent_at', { ascending: true });

  if (error) return [];
  return data || [];
}

export async function markMessageAsRead(messageId: string): Promise<void> {
  await supabase
    .from('message')
    .update({ is_read: true })
    .eq('message_id', messageId);
}

// ============ NOTIFICATION OPERATIONS ============

export async function createNotification(
  studentId: string,
  type: 'match_request' | 'message' | 'system' | 'report_update',
  content: string
): Promise<Notification> {
  const { data, error } = await supabase
    .from('notification')
    .insert([
      {
        student_id: studentId,
        type,
        content,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(`Failed to create notification: ${error.message}`);
  return data;
}

export async function getNotificationsForStudent(studentId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notification')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  await supabase
    .from('notification')
    .update({ is_read: true })
    .eq('notification_id', notificationId);
}

// ============ REPORT OPERATIONS ============

export async function createReport(
  reporterId: string | null,
  reportedId: string,
  reason: string
): Promise<Report> {
  const { data, error } = await supabase
    .from('report')
    .insert([
      {
        reporter_id: reporterId,
        reported_id: reportedId,
        reason,
        status: 'pending',
      },
    ])
    .select()
    .single();

  if (error) throw new Error(`Failed to create report: ${error.message}`);
  return data;
}

export async function getReports(status?: string): Promise<Report[]> {
  let query = supabase.from('report').select('*');

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function updateReportStatus(
  reportId: string,
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed',
  adminNotes?: string
): Promise<Report> {
  const { data, error } = await supabase
    .from('report')
    .update({
      status,
      admin_notes: adminNotes,
      resolved_at: new Date().toISOString(),
    })
    .eq('report_id', reportId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update report: ${error.message}`);
  return data;
}

// ============ BLOCK OPERATIONS ============

export async function blockUser(blockerId: string, blockedId: string): Promise<Block> {
  const { data, error } = await supabase
    .from('block')
    .insert([
      {
        blocker_id: blockerId,
        blocked_id: blockedId,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(`Failed to block user: ${error.message}`);
  return data;
}

export async function isUserBlocked(blockerId: string, blockedId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('block')
    .select('*')
    .eq('blocker_id', blockerId)
    .eq('blocked_id', blockedId)
    .single();

  if (error) return false;
  return !!data;
}

export async function unblockUser(blockerId: string, blockedId: string): Promise<void> {
  await supabase
    .from('block')
    .delete()
    .eq('blocker_id', blockerId)
    .eq('blocked_id', blockedId);
}

// ============ SEARCH & MATCHING ============

export async function searchProfiles(
  currentStudentId: string,
  filters?: {
    gender?: string;
    ageMin?: number;
    ageMax?: number;
    budgetMin?: number;
    budgetMax?: number;
    location?: string;
  }
): Promise<Profile[]> {
  let query = supabase
    .from('profile')
    .select('*')
    .neq('student_id', currentStudentId);

  if (filters?.gender && filters.gender !== 'any') {
    query = query.eq('gender', filters.gender);
  }
  if (filters?.ageMin) {
    query = query.gte('age', filters.ageMin);
  }
  if (filters?.ageMax) {
    query = query.lte('age', filters.ageMax);
  }

  const { data, error } = await query.limit(50);

  if (error) return [];
  return data || [];
}
