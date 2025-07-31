
// Test script to verify Supabase connection
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

console.log('Testing Supabase Connection...');
console.log('SUPABASE_URL:', supabaseUrl ? 'Set' : 'Not set');
console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Not set');

if (supabaseUrl && supabaseAnonKey) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Test connection by trying to fetch from users table
  supabase
    .from('users')
    .select('count', { count: 'exact' })
    .then(({ data, error, count }) => {
      if (error) {
        console.error('Connection failed:', error.message);
      } else {
        console.log('✅ Supabase connection successful!');
        console.log('Total users in database:', count);
      }
    })
    .catch(err => {
      console.error('Connection error:', err);
    });
} else {
  console.error('❌ Supabase environment variables not properly configured');
}
