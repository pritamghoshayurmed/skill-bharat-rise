// Script to apply video course migration
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = "https://ktzozcznjokemxmccfax.supabase.co";
const SUPABASE_SERVICE_KEY = "YOUR_SERVICE_KEY_HERE"; // Replace with actual service key

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function applyMigration() {
  try {
    console.log('🚀 Applying video course migration...');
    
    // Read the migration file
    const migrationSQL = fs.readFileSync('./supabase/migrations/20250712040000-enhance-video-courses.sql', 'utf8');
    
    // Split into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`⚡ Executing statement ${i + 1}/${statements.length}`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.error(`❌ Error in statement ${i + 1}:`, error);
        throw error;
      }
    }
    
    console.log('✅ Migration applied successfully!');
    
    // Test the new functions
    console.log('🧪 Testing YouTube ID extraction...');
    const { data: testResult } = await supabase.rpc('extract_youtube_id', {
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    });
    console.log('Test result:', testResult);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  applyMigration();
}

export { applyMigration };
