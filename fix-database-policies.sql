-- This script fixes the RLS policies for job posting
-- Run this in your Supabase SQL editor to fix job posting permissions

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Companies can manage their own jobs" ON public.jobs;
DROP POLICY IF EXISTS "Company users can create jobs" ON public.jobs;

-- Create clear, non-conflicting policies for jobs table
-- Allow anyone to view active jobs
CREATE POLICY "Anyone can view active jobs" ON public.jobs 
  FOR SELECT USING (is_active = TRUE);

-- Allow company users to create jobs
CREATE POLICY "Company users can create jobs" ON public.jobs 
  FOR INSERT WITH CHECK (
    auth.uid() = posted_by AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'company'
    )
  );

-- Allow job posters to update their own jobs
CREATE POLICY "Job posters can update their own jobs" ON public.jobs 
  FOR UPDATE USING (auth.uid() = posted_by);

-- Allow job posters to delete their own jobs
CREATE POLICY "Job posters can delete their own jobs" ON public.jobs 
  FOR DELETE USING (auth.uid() = posted_by);

-- Allow job posters to view all their jobs (including inactive ones)
CREATE POLICY "Job posters can view their own jobs" ON public.jobs 
  FOR SELECT USING (auth.uid() = posted_by);

-- Verify the policies are working by checking if we can insert a test job
-- (This will only work if you have a company user account)
-- INSERT INTO public.jobs (title, company, description, posted_by) 
-- VALUES ('Test Job', 'Test Company', 'Test Description', auth.uid());
