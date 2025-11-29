import 'dotenv/config.js';
import { supabase } from './services/supabase.js';
import * as authService from './services/auth.js';

const TEST_PASSWORD = 'password123';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Clean up ALL existing data (in correct order due to foreign keys)
    console.log('🧹 Cleaning up ALL existing data...');
    await supabase.from('message').delete().neq('message_id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('match').delete().neq('match_id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('match_request').delete().neq('request_id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('notification').delete().neq('notification_id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('report').delete().neq('report_id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('block').delete().neq('block_id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('lifestyle_preference').delete().neq('lifestyle_id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('basic_preference').delete().neq('preference_id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('profile').delete().neq('profile_id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('student').delete().neq('student_id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('admin').delete().neq('admin_id', '00000000-0000-0000-0000-000000000000');
    console.log('✅ All data cleaned\n');

    const hashedPassword = await authService.hashPassword(TEST_PASSWORD);

    console.log('📝 Creating admin user...');
    const adminResult = await supabase
      .from('admin')
      .insert({
        admin_email: 'admin@roommate.com',
        password_hash: hashedPassword,
      })
      .select()
      .single();

    if (adminResult.error) throw adminResult.error;
    const adminId = adminResult.data.admin_id;
    console.log(`✅ Admin user created: ${adminId}\n`);

    console.log('==========================================');
    console.log('✅ DATABASE SEEDING COMPLETE!\n');
    console.log('📋 Test Credentials:');
    console.log('==========================================');
    console.log(`\n🔓 Admin:\n   admin@roommate.com / ${TEST_PASSWORD}\n`);
    console.log('==========================================');
    console.log('ℹ️  Database ready for manual student registration\n');
    console.log('==========================================\n');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Seeding failed:', error.message || error);
    process.exit(1);
  }
}

seedDatabase();
