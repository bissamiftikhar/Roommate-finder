export interface Student {
  student_id: string;
  student_email: string;
  password_hash: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  last_login: string | null;
}

export interface Profile {
  profile_id: string;
  student_id: string;
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  personal_email: string | null;
  bio: string | null;
  phone: string | null;
  updated_at: string;
}

export interface BasicPreference {
  preference_id: string;
  student_id: string;
  gender_preference: 'any' | 'male' | 'female' | 'other';
  age_min: number;
  age_max: number;
  budget_min: number;
  budget_max: number;
  location_preference: string | null;
}

export interface LifestylePreference {
  lifestyle_id: string;
  student_id: string;
  sleep_schedule: 'early_bird' | 'normal' | 'night_owl' | 'flexible';
  cleanliness: 'very_clean' | 'moderate' | 'relaxed';
  guest_policy: 'never' | 'rarely' | 'sometimes' | 'often';
  smoking: boolean;
  pets: boolean;
  noise_tolerance: 'quiet' | 'moderate' | 'loud';
  study_habits: 'library' | 'home' | 'flexible';
}

export interface MatchRequest {
  request_id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  message: string | null;
  created_at: string;
  updated_at: string;
}

export interface Match {
  match_id: string;
  student1_id: string;
  student2_id: string;
  compatibility_score: number;
  status: 'active' | 'inactive';
  matched_at: string;
}

export interface Message {
  message_id: string;
  match_id: string;
  sender_id: string;
  content: string;
  sent_at: string;
  is_read: boolean;
}

export interface Notification {
  notification_id: string;
  student_id: string;
  type: 'match_request' | 'message' | 'system' | 'report_update';
  content: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Report {
  report_id: string;
  reporter_id: string | null;
  reported_id: string;
  reason: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  admin_notes: string | null;
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
}

export interface Admin {
  admin_id: string;
  admin_email: string;
  created_at: string;
}

export interface Block {
  block_id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  user: Student;
  profile: Profile | null;
}

export interface MatchWithDetails extends Match {
  profile: Profile;
  basicPreference: BasicPreference;
  lifestylePreference: LifestylePreference;
}
