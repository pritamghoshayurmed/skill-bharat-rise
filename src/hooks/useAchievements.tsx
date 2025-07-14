import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  date: string;
  description?: string;
}

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchAchievements = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // For now, we'll generate achievements based on user activity
      // In a real app, you'd have an achievements table
      const generatedAchievements: Achievement[] = [];

      // Check for course completions
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('course_enrollments')
        .select('*, course:courses(title)')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('completed_at', { ascending: false })
        .limit(3);

      if (enrollmentsError) throw enrollmentsError;

      if (enrollments && enrollments.length > 0) {
        enrollments.forEach((enrollment, index) => {
          generatedAchievements.push({
            id: `course-${enrollment.id}`,
            title: `Completed: ${enrollment.course?.title || 'Course'}`,
            icon: "🎓",
            date: new Date(enrollment.completed_at || enrollment.created_at).toLocaleDateString()
          });
        });
      }

      // Check for certificates
      const { data: certificates, error: certificatesError } = await supabase
        .from('certificates')
        .select('*, course:courses(title)')
        .eq('user_id', user.id)
        .order('issued_at', { ascending: false })
        .limit(2);

      if (certificatesError) throw certificatesError;

      if (certificates && certificates.length > 0) {
        certificates.forEach((certificate) => {
          generatedAchievements.push({
            id: `cert-${certificate.id}`,
            title: `Certificate Earned: ${certificate.course?.title || 'Course'}`,
            icon: "🏆",
            date: new Date(certificate.issued_at).toLocaleDateString()
          });
        });
      }

      // If no real achievements, show empty state
      if (generatedAchievements.length === 0) {
        generatedAchievements.push({
          id: 'welcome',
          title: 'Welcome to Skill Bharat!',
          icon: '👋',
          date: 'Today',
          description: 'Start your learning journey by enrolling in a course'
        });
      }

      setAchievements(generatedAchievements);
    } catch (error: any) {
      console.error('Error fetching achievements:', error);
      toast({
        title: "Error",
        description: "Failed to load achievements",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAchievements();
    }
  }, [user]);

  return { achievements, loading, refetch: fetchAchievements };
};
