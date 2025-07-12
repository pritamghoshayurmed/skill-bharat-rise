// Test helpers for job posting flow
import { supabase } from '@/integrations/supabase/client';

export const testCompanyRegistration = async () => {
  const testEmail = `test-company-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  
  try {
    // Test company registration
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test Company',
          user_type: 'company',
          category: 'university'
        }
      }
    });

    if (error) {
      console.error('Registration failed:', error);
      return { success: false, error: error.message };
    }

    console.log('Registration successful:', data);
    return { success: true, data, email: testEmail, password: testPassword };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Unexpected error' };
  }
};

export const testJobPosting = async () => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'No authenticated user' };
    }

    // Test job posting
    const testJob = {
      title: 'Test Software Developer',
      company: 'Test Tech Corp',
      location: 'Mumbai, India',
      job_type: 'Full-time',
      salary_range: '₹8-12 LPA',
      description: 'This is a test job posting to verify the job posting functionality works correctly.',
      requirements: ['Bachelor\'s degree', '2+ years experience'],
      skills_required: ['React', 'Node.js', 'JavaScript'],
      posted_by: user.id,
      is_active: true
    };

    const { data, error } = await supabase
      .from('jobs')
      .insert(testJob)
      .select()
      .single();

    if (error) {
      console.error('Job posting failed:', error);
      return { success: false, error: error.message };
    }

    console.log('Job posted successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Job posting error:', error);
    return { success: false, error: 'Unexpected error' };
  }
};

export const testJobRetrieval = async () => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Job retrieval failed:', error);
      return { success: false, error: error.message };
    }

    console.log('Jobs retrieved successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Job retrieval error:', error);
    return { success: false, error: 'Unexpected error' };
  }
};

// Function to run all tests
export const runJobPostingTests = async () => {
  console.log('🧪 Starting Job Posting Flow Tests...');
  
  // Test 1: Job Retrieval (should work without authentication)
  console.log('\n📋 Test 1: Job Retrieval');
  const retrievalResult = await testJobRetrieval();
  console.log('Result:', retrievalResult);
  
  // Test 2: Company Registration
  console.log('\n👤 Test 2: Company Registration');
  const registrationResult = await testCompanyRegistration();
  console.log('Result:', registrationResult);
  
  if (registrationResult.success) {
    console.log('⚠️ Note: Check your email for verification link before proceeding with job posting test');
  }
  
  return {
    jobRetrieval: retrievalResult,
    companyRegistration: registrationResult
  };
};
