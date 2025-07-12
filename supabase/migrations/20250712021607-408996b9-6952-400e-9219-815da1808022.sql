
-- Create course_modules table for organizing course content
CREATE TABLE IF NOT EXISTS public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 1,
  duration_minutes INTEGER DEFAULT 0,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course_lessons table for individual lessons within modules
CREATE TABLE IF NOT EXISTS public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 1,
  lesson_type TEXT DEFAULT 'video',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course_reviews table for student feedback
CREATE TABLE IF NOT EXISTS public.course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

-- Enable RLS on new tables
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for course_modules
CREATE POLICY "Anyone can view course modules" ON public.course_modules FOR SELECT USING (true);
CREATE POLICY "Company users can manage course modules" ON public.course_modules FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_type = 'company'
  )
);

-- RLS policies for course_lessons  
CREATE POLICY "Anyone can view course lessons" ON public.course_lessons FOR SELECT USING (true);
CREATE POLICY "Company users can manage course lessons" ON public.course_lessons FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_type = 'company'
  )
);

-- RLS policies for course_reviews
CREATE POLICY "Anyone can view course reviews" ON public.course_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create their own reviews" ON public.course_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON public.course_reviews FOR UPDATE USING (auth.uid() = user_id);

-- Update profiles table to support company user type
ALTER TABLE public.profiles ALTER COLUMN user_type DROP DEFAULT;
ALTER TABLE public.profiles ALTER COLUMN user_type SET DEFAULT 'student';

-- Update jobs table to ensure company users can post jobs
CREATE POLICY "Company users can create jobs" ON public.jobs FOR INSERT WITH CHECK (
  auth.uid() = posted_by AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_type = 'company'
  )
);

-- Update courses table to allow company users to create courses
CREATE POLICY "Company users can create courses" ON public.courses FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_type = 'company'
  )
);

CREATE POLICY "Company users can update their courses" ON public.courses FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_type = 'company'
  )
);
