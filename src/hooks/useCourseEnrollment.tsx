
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  progress: number | null;
  completed: boolean | null;
}

export const useCourseEnrollment = (courseId: string) => {
  const [enrollment, setEnrollment] = useState<CourseEnrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchEnrollment = async () => {
    if (!user || !courseId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setEnrollment(data);
    } catch (error: any) {
      console.error('Error fetching enrollment:', error);
      toast({
        title: "Error",
        description: "Failed to load enrollment status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const enrollInCourse = async () => {
    if (!user || !courseId) return;

    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          progress: 0,
          completed: false
        })
        .select()
        .single();

      if (error) throw error;
      setEnrollment(data);
      
      toast({
        title: "Success",
        description: "Successfully enrolled in course!",
      });

      // Update course enrollment count
      await supabase.rpc('increment', {
        table_name: 'courses',
        row_id: courseId,
        column_name: 'students_enrolled'
      });

    } catch (error: any) {
      console.error('Error enrolling in course:', error);
      toast({
        title: "Error",
        description: "Failed to enroll in course",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchEnrollment();
  }, [user, courseId]);

  return { enrollment, loading, enrollInCourse, refetch: fetchEnrollment };
};
