import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Lab {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: string | null;
  duration: string | null;
  participants: number | null;
  icon_name: string | null;
  gradient_colors: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

export const useLab = (labId: string) => {
  const [lab, setLab] = useState<Lab | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLab = async () => {
    if (!labId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('labs')
        .select('*')
        .eq('id', labId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setLab(data);
    } catch (error: any) {
      console.error('Error fetching lab:', error);
      toast({
        title: "Error",
        description: "Failed to load lab details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (labId) {
      fetchLab();
    }
  }, [labId]);

  return { lab, loading, refetch: fetchLab };
};
