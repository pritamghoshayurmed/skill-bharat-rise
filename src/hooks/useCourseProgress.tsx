import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface ModuleProgress {
  module_id: string;
  module_title: string;
  total_lessons: number;
  completed_lessons: number;
  progress_percentage: number;
  total_duration_minutes: number;
  time_spent_minutes: number;
}

export interface CourseProgressData {
  course_id: string;
  total_lessons: number;
  completed_lessons: number;
  overall_progress: number;
  total_duration_minutes: number;
  time_spent_minutes: number;
  modules: ModuleProgress[];
  is_completed: boolean;
  completion_date: string | null;
}

export const useCourseProgress = (courseId: string) => {
  const [progressData, setProgressData] = useState<CourseProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchCourseProgress = useCallback(async () => {
    if (!user || !courseId) {
      setLoading(false);
      return;
    }

    try {
      // Get overall course progress using the existing function
      const { data: overallProgress, error: progressError } = await supabase
        .rpc('get_course_progress', { 
          p_user_id: user.id, 
          p_course_id: courseId 
        });

      if (progressError) throw progressError;

      // Get detailed module and lesson progress
      const { data: moduleData, error: moduleError } = await supabase
        .from('course_modules')
        .select(`
          id,
          title,
          duration_minutes,
          course_lessons (
            id,
            title,
            duration_minutes,
            lesson_progress (
              completed,
              progress_percentage,
              time_spent_minutes
            )
          )
        `)
        .eq('course_id', courseId)
        .order('order_index');

      if (moduleError) throw moduleError;

      // Calculate module progress
      const modules: ModuleProgress[] = moduleData.map(module => {
        const lessons = module.course_lessons || [];
        const totalLessons = lessons.length;
        const completedLessons = lessons.filter(lesson => 
          lesson.lesson_progress?.[0]?.completed
        ).length;
        
        const totalDuration = lessons.reduce((sum, lesson) => 
          sum + (lesson.duration_minutes || 0), 0
        );
        
        const timeSpent = lessons.reduce((sum, lesson) => 
          sum + (lesson.lesson_progress?.[0]?.time_spent_minutes || 0), 0
        );

        return {
          module_id: module.id,
          module_title: module.title,
          total_lessons: totalLessons,
          completed_lessons: completedLessons,
          progress_percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
          total_duration_minutes: totalDuration,
          time_spent_minutes: timeSpent
        };
      });

      // Calculate overall statistics
      const totalLessons = modules.reduce((sum, module) => sum + module.total_lessons, 0);
      const completedLessons = modules.reduce((sum, module) => sum + module.completed_lessons, 0);
      const totalDuration = modules.reduce((sum, module) => sum + module.total_duration_minutes, 0);
      const totalTimeSpent = modules.reduce((sum, module) => sum + module.time_spent_minutes, 0);
      
      const overallProgressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      const isCompleted = overallProgressPercentage === 100;

      // Check enrollment for completion date
      const { data: enrollment } = await supabase
        .from('course_enrollments')
        .select('completed_at')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('completed', true)
        .maybeSingle();

      const courseProgress: CourseProgressData = {
        course_id: courseId,
        total_lessons: totalLessons,
        completed_lessons: completedLessons,
        overall_progress: overallProgressPercentage,
        total_duration_minutes: totalDuration,
        time_spent_minutes: totalTimeSpent,
        modules,
        is_completed: isCompleted,
        completion_date: enrollment?.completed_at || null
      };

      setProgressData(courseProgress);

      // Update course enrollment progress if it has changed
      if (isCompleted) {
        await updateCourseCompletion();
      } else {
        await updateCourseProgress(overallProgressPercentage);
      }

    } catch (error: any) {
      console.error('Error fetching course progress:', error);
      toast({
        title: "Error",
        description: "Failed to load course progress",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, courseId, toast]);

  const updateCourseProgress = useCallback(async (progressPercentage: number) => {
    if (!user || !courseId) return;

    try {
      const { error } = await supabase
        .from('course_enrollments')
        .update({ 
          progress: progressPercentage,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error updating course progress:', error);
    }
  }, [user, courseId]);

  const updateCourseCompletion = useCallback(async () => {
    if (!user || !courseId) return;

    try {
      const { error } = await supabase
        .from('course_enrollments')
        .update({ 
          progress: 100,
          completed: true,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (error) throw error;

      toast({
        title: "Course Completed! 🎉",
        description: "Congratulations! You've completed the entire course. You can now generate your certificate.",
      });
    } catch (error: any) {
      console.error('Error updating course completion:', error);
    }
  }, [user, courseId, toast]);

  useEffect(() => {
    fetchCourseProgress();
  }, [fetchCourseProgress]);

  return {
    progressData,
    loading,
    refetch: fetchCourseProgress,
    updateCourseProgress,
    updateCourseCompletion
  };
};
