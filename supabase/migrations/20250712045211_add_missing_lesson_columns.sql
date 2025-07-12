-- Add missing columns to course_lessons table
-- This fixes the "Could not find the 'is_preview' column" error

-- Add the missing columns if they don't exist
ALTER TABLE public.course_lessons
ADD COLUMN IF NOT EXISTS is_preview BOOLEAN DEFAULT false;

ALTER TABLE public.course_lessons
ADD COLUMN IF NOT EXISTS youtube_video_id TEXT;

ALTER TABLE public.course_lessons
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_lessons_module_order ON public.course_lessons(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_course_lessons_preview ON public.course_lessons(is_preview) WHERE is_preview = true;