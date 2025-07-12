
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Course {
  id: string;
  title: string;
  description: string | null;
  instructor: string | null;
  duration: string | null;
  level: string | null;
  category: string | null;
  price: number | null;
  rating: number | null;
  students_enrolled: number | null;
  image_url: string | null;
  is_featured: boolean | null;
  created_at: string;
  updated_at: string;
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return { courses, loading, refetch: fetchCourses };
};
