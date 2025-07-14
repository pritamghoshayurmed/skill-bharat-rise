-- Enhance course system for YouTube video support

-- Add YouTube-specific fields to course_lessons table
ALTER TABLE public.course_lessons 
ADD COLUMN IF NOT EXISTS youtube_video_id TEXT,
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS is_preview BOOLEAN DEFAULT false;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_course_lessons_module_order ON public.course_lessons(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_course_modules_course_order ON public.course_modules(course_id, order_index);

-- Function to extract YouTube video ID from URL
CREATE OR REPLACE FUNCTION extract_youtube_id(video_url TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Handle different YouTube URL formats
  IF video_url ~ 'youtube\.com/watch\?v=' THEN
    RETURN substring(video_url from 'v=([a-zA-Z0-9_-]+)');
  ELSIF video_url ~ 'youtu\.be/' THEN
    RETURN substring(video_url from 'youtu\.be/([a-zA-Z0-9_-]+)');
  ELSIF video_url ~ 'youtube\.com/embed/' THEN
    RETURN substring(video_url from 'embed/([a-zA-Z0-9_-]+)');
  ELSE
    RETURN NULL;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to generate YouTube thumbnail URL
CREATE OR REPLACE FUNCTION generate_youtube_thumbnail(video_id TEXT)
RETURNS TEXT AS $$
BEGIN
  IF video_id IS NOT NULL AND video_id != '' THEN
    RETURN 'https://img.youtube.com/vi/' || video_id || '/maxresdefault.jpg';
  ELSE
    RETURN NULL;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically extract YouTube ID and generate thumbnail
CREATE OR REPLACE FUNCTION update_youtube_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.video_url IS NOT NULL AND NEW.video_url != '' THEN
    NEW.youtube_video_id := extract_youtube_id(NEW.video_url);
    NEW.thumbnail_url := generate_youtube_thumbnail(NEW.youtube_video_id);
  ELSE
    NEW.youtube_video_id := NULL;
    NEW.thumbnail_url := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_youtube_fields ON public.course_lessons;
CREATE TRIGGER trigger_update_youtube_fields
  BEFORE INSERT OR UPDATE ON public.course_lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_youtube_fields();

-- Function to create a lesson with YouTube video
CREATE OR REPLACE FUNCTION create_course_lesson(
  p_module_id UUID,
  p_title TEXT,
  p_content TEXT DEFAULT NULL,
  p_video_url TEXT DEFAULT NULL,
  p_duration_minutes INTEGER DEFAULT 0,
  p_order_index INTEGER DEFAULT 1,
  p_is_preview BOOLEAN DEFAULT false
)
RETURNS UUID AS $$
DECLARE
  lesson_id UUID;
BEGIN
  INSERT INTO public.course_lessons (
    module_id,
    title,
    content,
    video_url,
    duration_minutes,
    order_index,
    lesson_type,
    is_preview
  ) VALUES (
    p_module_id,
    p_title,
    p_content,
    p_video_url,
    p_duration_minutes,
    p_order_index,
    CASE WHEN p_video_url IS NOT NULL THEN 'video' ELSE 'text' END,
    p_is_preview
  ) RETURNING id INTO lesson_id;
  
  RETURN lesson_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get course with modules and lessons
CREATE OR REPLACE FUNCTION get_course_with_content(p_course_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'course', row_to_json(c),
    'modules', (
      SELECT json_agg(
        json_build_object(
          'module', row_to_json(m),
          'lessons', (
            SELECT json_agg(row_to_json(l) ORDER BY l.order_index)
            FROM public.course_lessons l
            WHERE l.module_id = m.id
          )
        ) ORDER BY m.order_index
      )
      FROM public.course_modules m
      WHERE m.course_id = c.id
    )
  ) INTO result
  FROM public.courses c
  WHERE c.id = p_course_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Update RLS policies for lessons
CREATE POLICY "Anyone can view course lessons" ON public.course_lessons 
  FOR SELECT USING (true);

CREATE POLICY "Company users can manage course lessons" ON public.course_lessons 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'company'
    )
  );

-- Add some sample data for testing (optional)
-- This will be commented out in production
/*
-- Insert a sample course with video lessons
DO $$
DECLARE
  course_id UUID;
  module_id UUID;
BEGIN
  -- Create a sample course
  INSERT INTO public.courses (title, description, instructor, category, level, price)
  VALUES (
    'YouTube Video Course Sample',
    'A sample course demonstrating YouTube video integration',
    'Test Instructor',
    'Programming',
    'Beginner',
    0
  ) RETURNING id INTO course_id;
  
  -- Create a module
  INSERT INTO public.course_modules (course_id, title, description, order_index)
  VALUES (
    course_id,
    'Introduction to Programming',
    'Basic programming concepts',
    1
  ) RETURNING id INTO module_id;
  
  -- Create lessons with YouTube videos
  PERFORM create_course_lesson(
    module_id,
    'What is Programming?',
    'Introduction to programming concepts',
    'https://www.youtube.com/watch?v=zOjov-2OZ0E',
    15,
    1,
    true
  );
  
  PERFORM create_course_lesson(
    module_id,
    'Variables and Data Types',
    'Learn about variables and data types',
    'https://www.youtube.com/watch?v=9CV6QHkTzxw',
    20,
    2,
    false
  );
END $$;
*/
