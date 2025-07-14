import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface CompanyStats {
  totalApplications: number;
  profileViews: number;
  activeJobs: number;
  coursesCreated: number;
}

export const useCompanyStats = () => {
  const [stats, setStats] = useState<CompanyStats>({
    totalApplications: 0,
    profileViews: 0,
    activeJobs: 0,
    coursesCreated: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchStats = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch applications for company's jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('id')
        .eq('posted_by', user.id)
        .eq('is_active', true);

      if (jobsError) throw jobsError;

      const jobIds = jobsData?.map(job => job.id) || [];
      
      let applicationsCount = 0;
      if (jobIds.length > 0) {
        const { count: applicationsCountResult, error: applicationsError } = await supabase
          .from('job_applications')
          .select('*', { count: 'exact', head: true })
          .in('job_id', jobIds);

        if (applicationsError) throw applicationsError;
        applicationsCount = applicationsCountResult || 0;
      }

      // Fetch active jobs count
      const { count: activeJobsCount, error: activeJobsError } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('posted_by', user.id)
        .eq('is_active', true);

      if (activeJobsError) throw activeJobsError;

      // Fetch courses created count (assuming companies can create courses)
      const { count: coursesCount, error: coursesError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });
        // Note: We might need to add a created_by field to courses table to filter by company

      if (coursesError) throw coursesError;

      setStats({
        totalApplications: applicationsCount,
        profileViews: 0, // This would require a separate tracking system
        activeJobs: activeJobsCount || 0,
        coursesCreated: coursesCount || 0
      });
    } catch (error: any) {
      console.error('Error fetching company stats:', error);
      toast({
        title: "Error",
        description: "Failed to load company statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  return { stats, loading, refetch: fetchStats };
};
