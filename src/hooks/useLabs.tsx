
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

export const useLabs = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLabs = async () => {
    try {
      const { data, error } = await supabase
        .from('labs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLabs(data || []);
    } catch (error: any) {
      console.error('Error fetching labs:', error);
      toast({
        title: "Error",
        description: "Failed to load labs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  return { labs, loading, refetch: fetchLabs };
};
