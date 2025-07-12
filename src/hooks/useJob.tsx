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

export const useJob = (jobId: string) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchJob = async () => {
    if (!jobId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setJob(data);
    } catch (error: any) {
      console.error('Error fetching job:', error);
      toast({
        title: "Error",
        description: "Failed to load job details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  return { job, loading, refetch: fetchJob };
};
