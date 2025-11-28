import {
  Profile,
  BasicPreference,
  LifestylePreference,
  MatchWithDetails,
} from '../types/index.js';
import * as db from './database.js';

/**
 * Calculate compatibility score between two users
 * Score from 0-100 based on matching preferences
 */
export async function calculateCompatibilityScore(
  student1Id: string,
  student2Id: string
): Promise<number> {
  const profile1 = await db.getProfileByStudentId(student1Id);
  const profile2 = await db.getProfileByStudentId(student2Id);
  const prefs1 = await db.getBasicPreferenceByStudentId(student1Id);
  const prefs2 = await db.getBasicPreferenceByStudentId(student2Id);
  const lifestyle1 = await db.getLifestylePreferenceByStudentId(student1Id);
  const lifestyle2 = await db.getLifestylePreferenceByStudentId(student2Id);

  if (!profile1 || !profile2 || !prefs1 || !prefs2 || !lifestyle1 || !lifestyle2) {
    return 0;
  }

  let score = 0;
  let criteriaCount = 0;

  // Age compatibility (20 points)
  if (
    profile1.age >= prefs2.age_min &&
    profile1.age <= prefs2.age_max &&
    profile2.age >= prefs1.age_min &&
    profile2.age <= prefs1.age_max
  ) {
    score += 20;
  }
  criteriaCount += 20;

  // Budget compatibility (20 points)
  if (
    (prefs1.budget_min || 0) <= (prefs2.budget_max || Infinity) &&
    (prefs1.budget_max || Infinity) >= (prefs2.budget_min || 0)
  ) {
    score += 20;
  }
  criteriaCount += 20;

  // Gender preference (15 points)
  if (
    (prefs1.gender_preference === 'any' || prefs1.gender_preference === profile2.gender) &&
    (prefs2.gender_preference === 'any' || prefs2.gender_preference === profile1.gender)
  ) {
    score += 15;
  }
  criteriaCount += 15;

  // Sleep schedule compatibility (10 points)
  if (lifestyle1.sleep_schedule === lifestyle2.sleep_schedule) {
    score += 10;
  }
  criteriaCount += 10;

  // Cleanliness compatibility (10 points)
  if (lifestyle1.cleanliness === lifestyle2.cleanliness) {
    score += 10;
  }
  criteriaCount += 10;

  // Smoking/Pets compatibility (10 points)
  if (lifestyle1.smoking === lifestyle2.smoking && lifestyle1.pets === lifestyle2.pets) {
    score += 10;
  }
  criteriaCount += 10;

  // Guest policy compatibility (5 points)
  const guestScoreMap: { [key: string]: number } = {
    never: 0,
    rarely: 1,
    sometimes: 2,
    often: 3,
  };
  const guestDifference = Math.abs(
    (guestScoreMap[lifestyle1.guest_policy] || 0) -
      (guestScoreMap[lifestyle2.guest_policy] || 0)
  );
  if (guestDifference <= 1) {
    score += 5;
  }
  criteriaCount += 5;

  // Normalize to 100
  return Math.round((score / criteriaCount) * 100);
}

/**
 * Find matching profiles for a student based on their preferences
 */
export async function findMatches(
  studentId: string,
  limit: number = 10
): Promise<MatchWithDetails[]> {
  const prefs = await db.getBasicPreferenceByStudentId(studentId);
  if (!prefs) {
    return [];
  }

  // Get all profiles that match basic criteria
  const potentialMatches = await db.searchProfiles(studentId, {
    gender: prefs.gender_preference,
    ageMin: prefs.age_min,
    ageMax: prefs.age_max,
    budgetMin: prefs.budget_min,
    budgetMax: prefs.budget_max,
    location: prefs.location_preference || undefined,
  });

  // Calculate compatibility for each and sort
  const matchesWithScores = await Promise.all(
    potentialMatches.map(async (profile) => {
      const score = await calculateCompatibilityScore(studentId, profile.student_id);
      const basicPreference = await db.getBasicPreferenceByStudentId(profile.student_id);
      const lifestylePreference = await db.getLifestylePreferenceByStudentId(
        profile.student_id
      );

      return {
        match_id: '',
        student1_id: studentId,
        student2_id: profile.student_id,
        compatibility_score: score,
        status: 'active' as const,
        matched_at: new Date().toISOString(),
        profile,
        basicPreference: basicPreference!,
        lifestylePreference: lifestylePreference!,
      };
    })
  );

  return matchesWithScores
    .sort((a, b) => b.compatibility_score - a.compatibility_score)
    .slice(0, limit);
}
