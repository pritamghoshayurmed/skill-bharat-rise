import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AppStats {
  totalUsers: number;
  activeCourses: number;
  totalJobs: number;
  certificatesIssued: number;
  totalEnrollments: number;
  totalApplications: number;
}

export const useStats = () => {
  const [stats, setStats] = useState<AppStats>({
    totalUsers: 0,
    activeCourses: 0,
    totalJobs: 0,
    certificatesIssued: 0,
    totalEnrollments: 0,
    totalApplications: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      // Fetch total users count
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw usersError;

      // Fetch active courses count
      const { count: coursesCount, error: coursesError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      if (coursesError) throw coursesError;

      // Fetch total jobs count
      const { count: jobsCount, error: jobsError } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (jobsError) throw jobsError;

      // Fetch certificates count
      const { count: certificatesCount, error: certificatesError } = await supabase
        .from('certificates')
        .select('*', { count: 'exact', head: true });

      if (certificatesError) throw certificatesError;

      // Fetch enrollments count
      const { count: enrollmentsCount, error: enrollmentsError } = await supabase
        .from('course_enrollments')
        .select('*', { count: 'exact', head: true });

      if (enrollmentsError) throw enrollmentsError;

      // Fetch job applications count
      const { count: applicationsCount, error: applicationsError } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true });

      if (applicationsError) throw applicationsError;

      setStats({
        totalUsers: usersCount || 0,
        activeCourses: coursesCount || 0,
        totalJobs: jobsCount || 0,
        certificatesIssued: certificatesCount || 0,
        totalEnrollments: enrollmentsCount || 0,
        totalApplications: applicationsCount || 0
      });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to load statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, refetch: fetchStats };
};
