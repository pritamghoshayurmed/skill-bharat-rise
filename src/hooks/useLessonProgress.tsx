import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  progress_percentage: number;
  time_spent_minutes: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LessonProgressUpdate {
  progress_percentage?: number;
  time_spent_minutes?: number;
  completed?: boolean;
}

export const useLessonProgress = (lessonId: string) => {
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchProgress = useCallback(async () => {
    if (!user || !lessonId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .maybeSingle();

      if (error) throw error;
      setProgress(data);
    } catch (error: any) {
      console.error('Error fetching lesson progress:', error);
      toast({
        title: "Error",
        description: "Failed to load lesson progress",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, lessonId, toast]);

  const updateProgress = useCallback(async (updates: LessonProgressUpdate) => {
    if (!user || !lessonId) return;

    setUpdating(true);
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
        ...(updates.completed && { completed_at: new Date().toISOString() })
      };

      const { data, error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          ...updateData
        }, {
          onConflict: 'user_id,lesson_id'
        })
        .select()
        .single();

      if (error) throw error;
      setProgress(data);

      if (updates.completed) {
        toast({
          title: "Lesson Completed!",
          description: "Great job! You've completed this lesson.",
        });
      }
    } catch (error: any) {
      console.error('Error updating lesson progress:', error);
      toast({
        title: "Error",
        description: "Failed to update lesson progress",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  }, [user, lessonId, toast]);

  const markAsCompleted = useCallback(async () => {
    await updateProgress({ 
      completed: true, 
      progress_percentage: 100 
    });
  }, [updateProgress]);

  const updateTimeSpent = useCallback(async (additionalMinutes: number) => {
    const currentTimeSpent = progress?.time_spent_minutes || 0;
    await updateProgress({ 
      time_spent_minutes: currentTimeSpent + additionalMinutes 
    });
  }, [progress, updateProgress]);

  const updateProgressPercentage = useCallback(async (percentage: number) => {
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    await updateProgress({ 
      progress_percentage: clampedPercentage,
      ...(clampedPercentage === 100 && { completed: true })
    });
  }, [updateProgress]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return {
    progress,
    loading,
    updating,
    updateProgress,
    markAsCompleted,
    updateTimeSpent,
    updateProgressPercentage,
    refetch: fetchProgress
  };
};
