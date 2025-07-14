-- Add sample video lessons for testing the course player

-- First, let's check if we have any existing courses and add video lessons to them
DO $$
DECLARE
  course_rec RECORD;
  module_rec RECORD;
  lesson_count INTEGER;
BEGIN
  -- Loop through existing courses
  FOR course_rec IN SELECT id, title FROM public.courses LIMIT 3 LOOP
    RAISE NOTICE 'Processing course: %', course_rec.title;
    
    -- Check if this course has modules
    FOR module_rec IN SELECT id, title FROM public.course_modules WHERE course_id = course_rec.id LIMIT 2 LOOP
      RAISE NOTICE 'Processing module: %', module_rec.title;
      
      -- Count existing lessons in this module
      SELECT COUNT(*) INTO lesson_count FROM public.course_lessons WHERE module_id = module_rec.id;
      
      -- Add sample video lessons if there are fewer than 3 lessons
      IF lesson_count < 3 THEN
        -- Add first lesson (preview)
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
          module_rec.id,
          'Introduction Video',
          '<p>Welcome to this course! This is an introduction video that covers the basics.</p>',
          'https://www.youtube.com/watch?v=zOjov-2OZ0E',
          15,
          lesson_count + 1,
          'video',
          true
        ) ON CONFLICT DO NOTHING;
        
        -- Add second lesson
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
          module_rec.id,
          'Core Concepts',
          '<p>In this lesson, we dive deeper into the core concepts and fundamentals.</p>',
          'https://www.youtube.com/watch?v=9CV6QHkTzxw',
          25,
          lesson_count + 2,
          'video',
          false
        ) ON CONFLICT DO NOTHING;
        
        -- Add third lesson
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
          module_rec.id,
          'Practical Examples',
          '<p>Let''s look at some practical examples and real-world applications.</p>',
          'https://www.youtube.com/watch?v=rfscVS0vtbw',
          30,
          lesson_count + 3,
          'video',
          false
        ) ON CONFLICT DO NOTHING;
        
        RAISE NOTICE 'Added video lessons to module: %', module_rec.title;
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- Update any existing lessons that don't have video URLs with sample YouTube videos
UPDATE public.course_lessons 
SET 
  video_url = CASE 
    WHEN order_index % 3 = 1 THEN 'https://www.youtube.com/watch?v=zOjov-2OZ0E'
    WHEN order_index % 3 = 2 THEN 'https://www.youtube.com/watch?v=9CV6QHkTzxw'
    ELSE 'https://www.youtube.com/watch?v=rfscVS0vtbw'
  END,
  lesson_type = 'video',
  is_preview = (order_index = 1) -- Make first lesson of each module a preview
WHERE video_url IS NULL OR video_url = '';

-- Ensure we have at least one course with proper video content for testing
INSERT INTO public.courses (
  title,
  description,
  instructor,
  category,
  level,
  price,
  duration,
  rating,
  students_enrolled
) VALUES (
  'Complete Web Development Course',
  'Learn web development from scratch with hands-on projects and real-world examples. This comprehensive course covers HTML, CSS, JavaScript, and modern frameworks.',
  'John Smith',
  'Programming',
  'Beginner',
  0,
  '40 hours',
  4.8,
  1250
) ON CONFLICT DO NOTHING;

-- Get the course ID for the web development course
DO $$
DECLARE
  web_course_id UUID;
  intro_module_id UUID;
  html_module_id UUID;
  css_module_id UUID;
BEGIN
  -- Get the course ID
  SELECT id INTO web_course_id FROM public.courses WHERE title = 'Complete Web Development Course' LIMIT 1;
  
  IF web_course_id IS NOT NULL THEN
    -- Create modules
    INSERT INTO public.course_modules (course_id, title, description, order_index)
    VALUES (
      web_course_id,
      'Introduction to Web Development',
      'Get started with web development fundamentals',
      1
    ) RETURNING id INTO intro_module_id;
    
    INSERT INTO public.course_modules (course_id, title, description, order_index)
    VALUES (
      web_course_id,
      'HTML Fundamentals',
      'Learn the building blocks of web pages',
      2
    ) RETURNING id INTO html_module_id;
    
    INSERT INTO public.course_modules (course_id, title, description, order_index)
    VALUES (
      web_course_id,
      'CSS Styling',
      'Make your web pages beautiful with CSS',
      3
    ) RETURNING id INTO css_module_id;
    
    -- Add lessons to Introduction module
    INSERT INTO public.course_lessons (module_id, title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
    VALUES 
    (intro_module_id, 'Welcome to Web Development', '<p>Welcome to the complete web development course! In this lesson, we''ll overview what you''ll learn.</p>', 'https://www.youtube.com/watch?v=zOjov-2OZ0E', 10, 1, 'video', true),
    (intro_module_id, 'Setting Up Your Development Environment', '<p>Learn how to set up your development environment with the right tools and editors.</p>', 'https://www.youtube.com/watch?v=9CV6QHkTzxw', 15, 2, 'video', false),
    (intro_module_id, 'Understanding How the Web Works', '<p>Get a fundamental understanding of how websites work and the technologies involved.</p>', 'https://www.youtube.com/watch?v=rfscVS0vtbw', 20, 3, 'video', false);
    
    -- Add lessons to HTML module
    INSERT INTO public.course_lessons (module_id, title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
    VALUES 
    (html_module_id, 'HTML Basics and Structure', '<p>Learn the basic structure of HTML documents and essential tags.</p>', 'https://www.youtube.com/watch?v=UB1O30fR-EE', 25, 1, 'video', true),
    (html_module_id, 'Working with Text and Links', '<p>Master text formatting and creating links between pages.</p>', 'https://www.youtube.com/watch?v=salY_Sm6mv4', 20, 2, 'video', false),
    (html_module_id, 'Images and Media Elements', '<p>Learn how to add images, videos, and other media to your web pages.</p>', 'https://www.youtube.com/watch?v=TSG_as5UUt8', 18, 3, 'video', false);
    
    -- Add lessons to CSS module
    INSERT INTO public.course_lessons (module_id, title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
    VALUES 
    (css_module_id, 'CSS Fundamentals', '<p>Introduction to CSS syntax, selectors, and basic styling properties.</p>', 'https://www.youtube.com/watch?v=yfoY53QXEnI', 30, 1, 'video', false),
    (css_module_id, 'Layout with Flexbox', '<p>Master modern CSS layout techniques using Flexbox.</p>', 'https://www.youtube.com/watch?v=JJSoEo8JSnc', 35, 2, 'video', false),
    (css_module_id, 'Responsive Design', '<p>Learn how to make your websites look great on all devices.</p>', 'https://www.youtube.com/watch?v=srvUrASNdxk', 40, 3, 'video', false);
    
    RAISE NOTICE 'Created complete web development course with video lessons';
  END IF;
END $$;
