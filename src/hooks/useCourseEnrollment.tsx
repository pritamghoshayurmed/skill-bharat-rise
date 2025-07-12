
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
}

export const useCourseEnrollment = (courseId: string) => {
  const [enrollment, setEnrollment] = useState<CourseEnrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchEnrollment = async () => {
    if (!user || !courseId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (error) throw error;
      setEnrollment(data);
    } catch (error: any) {
      console.error('Error fetching enrollment:', error);
    } finally {
      setLoading(false);
    }
  };

  const enrollInCourse = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to enroll in courses",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          progress: 0,
          completed: false
        });

      if (error) throw error;

      toast({
        title: "Enrolled Successfully!",
        description: "You have been enrolled in the course",
      });

      fetchEnrollment();
    } catch (error: any) {
      console.error('Error enrolling:', error);
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
