import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface StudentStats {
  completedCourses: number;
  totalCertificates: number;
  jobApplications: number;
  coursesEnrolled: number;
  averageScore: number;
  totalLearningHours: number;
}

export const useStudentStats = () => {
  const [stats, setStats] = useState<StudentStats>({
    completedCourses: 0,
    totalCertificates: 0,
    jobApplications: 0,
    coursesEnrolled: 0,
    averageScore: 0,
    totalLearningHours: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchStudentStats = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch total enrollments
      const { count: enrollmentsCount, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (enrollmentsError) throw enrollmentsError;

      // Fetch completed courses (enrollments with progress = 100)
      const { count: completedCount, error: completedError } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('progress', 100);

      if (completedError) throw completedError;

      // Fetch certificates count
      const { count: certificatesCount, error: certificatesError } = await supabase
        .from('certificates')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (certificatesError) throw certificatesError;

      // Fetch job applications count
      const { count: applicationsCount, error: applicationsError } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (applicationsError) throw applicationsError;

      // Fetch average score from certificates
      const { data: certificatesData, error: avgScoreError } = await supabase
        .from('certificates')
        .select('score')
        .eq('user_id', user.id)
        .not('score', 'is', null);

      if (avgScoreError) throw avgScoreError;

      let averageScore = 0;
      if (certificatesData && certificatesData.length > 0) {
        const totalScore = certificatesData.reduce((sum, cert) => sum + (cert.score || 0), 0);
        averageScore = Math.round(totalScore / certificatesData.length);
      }

      // Calculate total learning hours (estimate based on completed courses)
      // Assuming each course takes approximately 20 hours on average
      const totalLearningHours = (completedCount || 0) * 20;

      setStats({
        completedCourses: completedCount || 0,
        totalCertificates: certificatesCount || 0,
        jobApplications: applicationsCount || 0,
        coursesEnrolled: enrollmentsCount || 0,
        averageScore,
        totalLearningHours
      });
    } catch (error: any) {
      console.error('Error fetching student stats:', error);
      toast({
        title: "Error",
        description: "Failed to load student statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStudentStats();
    }
  }, [user]);

  return { stats, loading, refetch: fetchStudentStats };
};
