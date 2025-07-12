
-- Add course modules table for structured content
CREATE TABLE public.course_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add course lessons table
CREATE TABLE public.course_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL,
  lesson_type TEXT CHECK (lesson_type IN ('video', 'text', 'quiz', 'assignment')) DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add lesson progress tracking
CREATE TABLE public.lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  time_spent_minutes INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Add course reviews table
CREATE TABLE public.course_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

-- Enable RLS on new tables
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for course_modules
CREATE POLICY "Anyone can view course modules" ON public.course_modules FOR SELECT USING (TRUE);
CREATE POLICY "Only admins can manage course modules" ON public.course_modules FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
);

-- RLS policies for course_lessons
CREATE POLICY "Anyone can view course lessons" ON public.course_lessons FOR SELECT USING (TRUE);
CREATE POLICY "Only admins can manage course lessons" ON public.course_lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
);

-- RLS policies for lesson_progress
CREATE POLICY "Users can view their own lesson progress" ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own lesson progress" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);

-- RLS policies for course_reviews
CREATE POLICY "Anyone can view course reviews" ON public.course_reviews FOR SELECT USING (TRUE);
CREATE POLICY "Users can manage their own reviews" ON public.course_reviews FOR ALL USING (auth.uid() = user_id);

-- Insert sample course modules and lessons
INSERT INTO public.course_modules (course_id, title, description, order_index, duration_minutes) 
SELECT id, 'Introduction to ' || title, 'Getting started with the fundamentals', 1, 120
FROM public.courses 
WHERE title = 'Web Development Fundamentals';

INSERT INTO public.course_modules (course_id, title, description, order_index, duration_minutes) 
SELECT id, 'Advanced ' || title, 'Deep dive into advanced concepts', 2, 180
FROM public.courses 
WHERE title = 'Web Development Fundamentals';

-- Insert sample lessons
INSERT INTO public.course_lessons (module_id, title, content, lesson_type, order_index, duration_minutes)
SELECT cm.id, 
       'Lesson ' || generate_series(1,3) || ': ' || CASE 
         WHEN generate_series(1,3) = 1 THEN 'HTML Basics'
         WHEN generate_series(1,3) = 2 THEN 'CSS Fundamentals' 
         ELSE 'JavaScript Introduction'
       END,
       'This lesson covers the essential concepts and practical applications.',
       'video',
       generate_series(1,3),
       40
FROM public.course_modules cm
WHERE cm.title LIKE 'Introduction%';

-- Update courses with proper enrollment counts based on actual enrollments
UPDATE public.courses 
SET students_enrolled = (
  SELECT COUNT(*) 
  FROM public.course_enrollments 
  WHERE course_id = courses.id
);

-- Create function to update course rating based on reviews
CREATE OR REPLACE FUNCTION public.update_course_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.courses
  SET rating = (
    SELECT ROUND(AVG(rating)::numeric, 1)
    FROM public.course_reviews
    WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
  )
  WHERE id = COALESCE(NEW.course_id, OLD.course_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update course ratings
CREATE TRIGGER update_course_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.course_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_course_rating();

-- Create function to calculate course progress
CREATE OR REPLACE FUNCTION public.get_course_progress(p_user_id UUID, p_course_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
BEGIN
  -- Get total lessons in course
  SELECT COUNT(cl.id) INTO total_lessons
  FROM public.course_lessons cl
  JOIN public.course_modules cm ON cl.module_id = cm.id
  WHERE cm.course_id = p_course_id;
  
  -- Get completed lessons for user
  SELECT COUNT(lp.id) INTO completed_lessons
  FROM public.lesson_progress lp
  JOIN public.course_lessons cl ON lp.lesson_id = cl.id
  JOIN public.course_modules cm ON cl.module_id = cm.id
  WHERE cm.course_id = p_course_id 
    AND lp.user_id = p_user_id 
    AND lp.completed = TRUE;
  
  -- Return progress percentage
  IF total_lessons = 0 THEN
    RETURN 0;
  ELSE
    RETURN ROUND((completed_lessons::FLOAT / total_lessons::FLOAT) * 100);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
