-- Fix lesson creation RLS policies to allow both company and admin users
-- Run this in your Supabase SQL editor to fix lesson creation permissions

-- Drop existing conflicting policies for course_lessons
DROP POLICY IF EXISTS "Only admins can manage course lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "Company users can manage course lessons" ON public.course_lessons;

-- Create clear, non-conflicting policies for course_lessons table
-- Allow anyone to view course lessons
CREATE POLICY "Anyone can view course lessons" ON public.course_lessons 
  FOR SELECT USING (true);

-- Allow both company and admin users to create/manage lessons
CREATE POLICY "Company and admin users can manage course lessons" ON public.course_lessons 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type IN ('company', 'admin')
    )
  );

-- Also update course_modules policies to be consistent
DROP POLICY IF EXISTS "Only admins can manage course modules" ON public.course_modules;
DROP POLICY IF EXISTS "Company users can manage course modules" ON public.course_modules;

CREATE POLICY "Company and admin users can manage course modules" ON public.course_modules 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type IN ('company', 'admin')
    )
  );

-- Update courses policies to be consistent
DROP POLICY IF EXISTS "Only admins can manage courses" ON public.courses;
DROP POLICY IF EXISTS "Company users can create courses" ON public.courses;
DROP POLICY IF EXISTS "Company users can update their courses" ON public.courses;

CREATE POLICY "Company and admin users can manage courses" ON public.courses 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type IN ('company', 'admin')
    )
  );
