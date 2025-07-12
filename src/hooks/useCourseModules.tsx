
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  duration_minutes: number | null;
  is_locked: boolean | null;
  created_at: string;
  updated_at: string;
}

export const useCourseModules = (courseId: string) => {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchModules = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_course_modules', { p_course_id: courseId });

      if (error) throw error;
      setModules(data || []);
    } catch (error: any) {
      console.error('Error fetching course modules:', error);
      toast({
        title: "Error",
        description: "Failed to load course modules",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchModules();
    }
  }, [courseId]);

  return { modules, loading, refetch: fetchModules };
};
