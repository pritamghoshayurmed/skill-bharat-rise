import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  progress: number;
  completed: boolean;
  course?: {
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
  };
}

export const useUserEnrollments = () => {
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchEnrollments = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error: any) {
      console.error('Error fetching enrollments:', error);
      toast({
        title: "Error",
        description: "Failed to load your enrollments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [user]);

  return { enrollments, loading, refetch: fetchEnrollments };
};
