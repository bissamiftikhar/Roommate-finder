import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupDatabase() {
  try {
    console.log('Starting database cleanup...');

    // Delete in order of foreign key dependencies
    console.log('Deleting notification records...');
    const { error: notifError } = await supabase.from('notification').delete().gt('created_at', '1900-01-01');
    if (notifError) console.log('notification error:', notifError.message);

    console.log('Deleting message records...');
    const { error: messageError } = await supabase.from('message').delete().gt('sent_at', '1900-01-01');
    if (messageError) console.log('message error:', messageError.message);

    console.log('Deleting match_request records...');
    const { error: matchRequestError } = await supabase.from('match_request').delete().gt('created_at', '1900-01-01');
    if (matchRequestError) console.log('match_request error:', matchRequestError.message);

    console.log('Deleting match records...');
    const { error: matchError } = await supabase.from('match').delete().gt('matched_at', '1900-01-01');
    if (matchError) console.log('match error:', matchError.message);

    console.log('Deleting lifestyle_preference records...');
    const { error: lifestyleError } = await supabase.from('lifestyle_preference').delete().gt('lifestyle_id', '00000000-0000-0000-0000-000000000000');
    if (lifestyleError) console.log('lifestyle_preference error:', lifestyleError.message);

    console.log('Deleting basic_preference records...');
    const { error: basicError } = await supabase.from('basic_preference').delete().gt('preference_id', '00000000-0000-0000-0000-000000000000');
    if (basicError) console.log('basic_preference error:', basicError.message);

    console.log('Deleting profile records...');
    const { error: profileError } = await supabase.from('profile').delete().gt('profile_id', '00000000-0000-0000-0000-000000000000');
    if (profileError) console.log('profile error:', profileError.message);

    console.log('Deleting admin records...');
    const { error: adminError } = await supabase.from('admin').delete().gt('admin_id', '00000000-0000-0000-0000-000000000000');
    if (adminError) console.log('admin error:', adminError.message);

    console.log('Deleting student records...');
    const { error: studentError } = await supabase.from('student').delete().gt('student_id', '00000000-0000-0000-0000-000000000000');
    if (studentError) console.log('student error:', studentError.message);

    console.log('✅ Database cleanup complete!');
    console.log('All tables have been cleared. Ready for new registrations.');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Cleanup failed:', error.message);
    process.exit(1);
  }
}

cleanupDatabase();
