
-- Create functions to handle course management operations
CREATE OR REPLACE FUNCTION public.get_course_modules(p_course_id UUID)
RETURNS TABLE (
  id UUID,
  course_id UUID,
  title TEXT,
  description TEXT,
  order_index INTEGER,
  duration_minutes INTEGER,
  is_locked BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT cm.id, cm.course_id, cm.title, cm.description, cm.order_index, 
         cm.duration_minutes, cm.is_locked, cm.created_at, cm.updated_at
  FROM public.course_modules cm
  WHERE cm.course_id = p_course_id
  ORDER BY cm.order_index ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_course_lessons(p_module_id UUID)
RETURNS TABLE (
  id UUID,
  module_id UUID,
  title TEXT,
  content TEXT,
  video_url TEXT,
  duration_minutes INTEGER,
  order_index INTEGER,
  lesson_type TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT cl.id, cl.module_id, cl.title, cl.content, cl.video_url,
         cl.duration_minutes, cl.order_index, cl.lesson_type, cl.created_at, cl.updated_at
  FROM public.course_lessons cl
  WHERE cl.module_id = p_module_id
  ORDER BY cl.order_index ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_course_reviews(p_course_id UUID)
RETURNS TABLE (
  id UUID,
  course_id UUID,
  user_id UUID,
  rating INTEGER,
  review_text TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  full_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT cr.id, cr.course_id, cr.user_id, cr.rating, cr.review_text,
         cr.created_at, cr.updated_at, p.full_name
  FROM public.course_reviews cr
  LEFT JOIN public.profiles p ON cr.user_id = p.id
  WHERE cr.course_id = p_course_id
  ORDER BY cr.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.add_course_review(
  p_course_id UUID,
  p_rating INTEGER,
  p_review_text TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.course_reviews (course_id, user_id, rating, review_text)
  VALUES (p_course_id, auth.uid(), p_rating, p_review_text)
  ON CONFLICT (course_id, user_id) 
  DO UPDATE SET 
    rating = EXCLUDED.rating,
    review_text = EXCLUDED.review_text,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.create_course_module(
  p_course_id UUID,
  p_title TEXT,
  p_description TEXT,
  p_duration_minutes INTEGER,
  p_order_index INTEGER
)
RETURNS UUID AS $$
DECLARE
  new_module_id UUID;
BEGIN
  INSERT INTO public.course_modules (
    course_id, title, description, duration_minutes, order_index
  ) VALUES (
    p_course_id, p_title, p_description, p_duration_minutes, p_order_index
  ) RETURNING id INTO new_module_id;
  
  RETURN new_module_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.create_course_lesson(
  p_module_id UUID,
  p_title TEXT,
  p_content TEXT,
  p_video_url TEXT,
  p_duration_minutes INTEGER,
  p_order_index INTEGER,
  p_lesson_type TEXT
)
RETURNS UUID AS $$
DECLARE
  new_lesson_id UUID;
BEGIN
  INSERT INTO public.course_lessons (
    module_id, title, content, video_url, duration_minutes, order_index, lesson_type
  ) VALUES (
    p_module_id, p_title, p_content, p_video_url, p_duration_minutes, p_order_index, p_lesson_type
  ) RETURNING id INTO new_lesson_id;
  
  RETURN new_lesson_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
