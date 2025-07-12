
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string | null;
  job_type: string | null;
  salary_range: string | null;
  description: string | null;
  requirements: string[] | null;
  skills_required: string[] | null;
  posted_by: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return { jobs, loading, refetch: fetchJobs };
};
