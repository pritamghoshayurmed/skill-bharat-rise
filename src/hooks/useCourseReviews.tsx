
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CourseReview {
  id: string;
  course_id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
  };
}

export const useCourseReviews = (courseId: string) => {
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('course_reviews')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      console.error('Error fetching course reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load course reviews",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (rating: number, reviewText: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('course_reviews')
        .upsert({
          course_id: courseId,
          user_id: userId,
          rating,
          review_text: reviewText
        })
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Review submitted successfully!",
      });

      await fetchReviews();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchReviews();
    }
  }, [courseId]);

  return { reviews, loading, submitReview, refetch: fetchReviews };
};
