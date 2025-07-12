
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CourseLesson {
  id: string;
  module_id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  duration_minutes: number | null;
  order_index: number;
  lesson_type: string | null;
  created_at: string;
  updated_at: string;
}

export const useCourseLessons = (moduleId: string) => {
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLessons = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_course_lessons', { p_module_id: moduleId });

      if (error) throw error;
      setLessons(data || []);
    } catch (error: any) {
      console.error('Error fetching course lessons:', error);
      toast({
        title: "Error",
        description: "Failed to load course lessons",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (moduleId) {
      fetchLessons();
    }
  }, [moduleId]);

  return { lessons, loading, refetch: fetchLessons };
};
