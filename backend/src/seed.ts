import 'dotenv/config.js';
import { supabase } from './services/supabase.js';
import * as authService from './services/auth.js';

const TEST_PASSWORD = 'password123';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...\n');

    const hashedPassword = await authService.hashPassword(TEST_PASSWORD);

    console.log('📝 Creating admin user...');
    const adminResult = await supabase
      .from('student')
      .insert({
        student_email: 'admin@roommate.com',
        password_hash: hashedPassword,
      })
      .select()
      .single();

    if (adminResult.error) throw adminResult.error;
    const adminId = adminResult.data.student_id;
    console.log(`✅ Admin user created: ${adminId}\n`);

    await supabase.from('profile').insert({
      student_id: adminId,
      first_name: 'Admin',
      last_name: 'User',
      age: 30,
      bio: 'System administrator',
      university: 'Admin University',
      major: 'Administration',
      year: 'Senior',
    });

    console.log('📝 Creating test student accounts...');
    const testStudents = [
      { email: 'alice@example.com', name: { first: 'Alice', last: 'Smith' }, age: 21, gender: 'Female', bio: 'Junior studying Computer Science. Love hiking and coffee!', university: 'State University', major: 'Computer Science', year: 'Junior' },
      { email: 'bob@example.com', name: { first: 'Bob', last: 'Johnson' }, age: 22, gender: 'Male', bio: 'Senior in Engineering. Quiet, clean, and studious.', university: 'State University', major: 'Mechanical Engineering', year: 'Senior' },
      { email: 'carol@example.com', name: { first: 'Carol', last: 'Davis' }, age: 20, gender: 'Female', bio: 'Sophomore, love music and movies. Looking for friendly roommate!', university: 'Tech Institute', major: 'Music Production', year: 'Sophomore' },
      { email: 'david@example.com', name: { first: 'David', last: 'Wilson' }, age: 23, gender: 'Male', bio: 'Senior in Business. Early bird, organized, no smoking.', university: 'Business College', major: 'Business Administration', year: 'Senior' },
      { email: 'emma@example.com', name: { first: 'Emma', last: 'Brown' }, age: 21, gender: 'Female', bio: 'Junior pre-med student. Quiet, responsible, looking for same.', university: 'State University', major: 'Biology', year: 'Junior' },
    ];

    const studentIds: { [key: string]: string } = {};

    for (const student of testStudents) {
      const result = await supabase
        .from('student')
        .insert({
          student_email: student.email,
          password_hash: hashedPassword,
        })
        .select()
        .single();

      if (result.error) throw result.error;
      const id = result.data.student_id;
      studentIds[student.email] = id;

      await supabase.from('profile').insert({
        student_id: id,
        first_name: student.name.first,
        last_name: student.name.last,
        age: student.age,
        gender: student.gender,
        bio: student.bio,
        university: student.university,
        major: student.major,
        year: student.year,
      });

      console.log(`✅ Created: ${student.email}`);
    }
    console.log();

    console.log('🎯 Creating basic preferences...');
    const basicPrefs = [
      { studentId: studentIds['alice@example.com'], minAge: 20, maxAge: 24, genderPreference: 'Any', budgetMin: 400, budgetMax: 600, location: 'Downtown' },
      { studentId: studentIds['bob@example.com'], minAge: 21, maxAge: 25, genderPreference: 'Any', budgetMin: 450, budgetMax: 650, location: 'Near campus' },
      { studentId: studentIds['carol@example.com'], minAge: 19, maxAge: 23, genderPreference: 'Female', budgetMin: 350, budgetMax: 550, location: 'Anywhere' },
      { studentId: studentIds['david@example.com'], minAge: 21, maxAge: 26, genderPreference: 'Any', budgetMin: 500, budgetMax: 700, location: 'Business district' },
      { studentId: studentIds['emma@example.com'], minAge: 20, maxAge: 24, genderPreference: 'Female', budgetMin: 400, budgetMax: 600, location: 'Quiet area' },
    ];

    for (const pref of basicPrefs) {
      await supabase.from('basic_preference').insert({
        student_id: pref.studentId,
        min_age: pref.minAge,
        max_age: pref.maxAge,
        gender_preference: pref.genderPreference,
        budget_min: pref.budgetMin,
        budget_max: pref.budgetMax,
        location_preference: pref.location,
      });
    }
    console.log(`✅ Basic preferences created\n`);

    console.log('🌙 Creating lifestyle preferences...');
    const lifestylePrefs = [
      { studentId: studentIds['alice@example.com'], sleepSchedule: 'Night owl', cleanliness: 'Very clean', smokingPolicy: 'No smoking', petPolicy: 'No pets', guestPolicy: 'Sometimes' },
      { studentId: studentIds['bob@example.com'], sleepSchedule: 'Early bird', cleanliness: 'Very clean', smokingPolicy: 'No smoking', petPolicy: 'No pets', guestPolicy: 'Rarely' },
      { studentId: studentIds['carol@example.com'], sleepSchedule: 'Night owl', cleanliness: 'Moderately clean', smokingPolicy: 'No smoking', petPolicy: 'Small pets ok', guestPolicy: 'Often' },
      { studentId: studentIds['david@example.com'], sleepSchedule: 'Early bird', cleanliness: 'Very clean', smokingPolicy: 'No smoking', petPolicy: 'No pets', guestPolicy: 'Rarely' },
      { studentId: studentIds['emma@example.com'], sleepSchedule: 'Early bird', cleanliness: 'Very clean', smokingPolicy: 'No smoking', petPolicy: 'No pets', guestPolicy: 'Rarely' },
    ];

    for (const pref of lifestylePrefs) {
      await supabase.from('lifestyle_preference').insert({
        student_id: pref.studentId,
        sleep_schedule: pref.sleepSchedule,
        cleanliness_level: pref.cleanliness,
        smoking_policy: pref.smokingPolicy,
        pet_policy: pref.petPolicy,
        guest_policy: pref.guestPolicy,
      });
    }
    console.log(`✅ Lifestyle preferences created\n`);

    console.log('�� Creating match requests...');
    const matchRequests = [
      { fromId: studentIds['alice@example.com'], toId: studentIds['bob@example.com'], message: 'Hey Bob, your profile looks great! I think we could be good roommates.' },
      { fromId: studentIds['carol@example.com'], toId: studentIds['emma@example.com'], message: 'Hi Emma! I love that you\'re also into quiet living. Let\'s chat!' },
      { fromId: studentIds['david@example.com'], toId: studentIds['bob@example.com'], message: 'Bob, we seem to have similar preferences. Interested?' },
    ];

    for (const req of matchRequests) {
      await supabase.from('match_request').insert({
        from_student_id: req.fromId,
        to_student_id: req.toId,
        message: req.message,
        status: 'pending',
      });
    }
    console.log(`✅ Match requests created\n`);

    console.log('🤝 Creating active matches...');
    const match = await supabase
      .from('match')
      .insert({
        student_1_id: studentIds['alice@example.com'],
        student_2_id: studentIds['carol@example.com'],
        compatibility_score: 87,
        status: 'active',
      })
      .select()
      .single();

    if (match.data) {
      const matchId = match.data.match_id;

      const messages = [
        { matchId, senderId: studentIds['alice@example.com'], content: 'Hi Carol! I think we could be great roommates!' },
        { matchId, senderId: studentIds['carol@example.com'], content: 'Hey Alice! I totally agree! When can we meet?' },
        { matchId, senderId: studentIds['alice@example.com'], content: 'How about this weekend at the cafe near campus?' },
      ];

      for (const msg of messages) {
        await supabase.from('message').insert({
          match_id: msg.matchId,
          sender_id: msg.senderId,
          content: msg.content,
        });
      }

      console.log(`✅ Active match created\n`);
    }

    console.log('==========================================');
    console.log('✅ DATABASE SEEDING COMPLETE!\n');
    console.log('📋 Test Credentials:');
    console.log('==========================================');
    console.log(`\n🔓 Admin:\n   admin@roommate.com / ${TEST_PASSWORD}\n`);
    console.log(`🧑 Users:\n   alice@example.com\n   bob@example.com\n   carol@example.com\n   david@example.com\n   emma@example.com\n   Password: ${TEST_PASSWORD}\n`);
    console.log('==========================================\n');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Seeding failed:', error.message || error);
    process.exit(1);
  }
}

seedDatabase();
