import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  certificate_url: string | null;
  issued_at: string;
  grade: string | null;
  score: number | null;
  // Joined course data
  course?: {
    title: string;
    category: string | null;
    instructor: string | null;
  };
}

export const useCertificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchCertificates = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          course:courses(
            title,
            category,
            instructor
          )
        `)
        .eq('user_id', user.id)
        .order('issued_at', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error: any) {
      console.error('Error fetching certificates:', error);
      toast({
        title: "Error",
        description: "Failed to load certificates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCertificates();
    }
  }, [user]);

  return { certificates, loading, refetch: fetchCertificates };
};
