
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
  profiles: {
    full_name: string | null;
  } | null;
}

export const useCourseReviews = (courseId: string) => {
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_course_reviews', { p_course_id: courseId });

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

  const addReview = async (rating: number, reviewText: string) => {
    try {
      const { error } = await supabase
        .rpc('add_course_review', { 
          p_course_id: courseId, 
          p_rating: rating, 
          p_review_text: reviewText 
        });

      if (error) throw error;
      
      toast({
        title: "Review Added!",
        description: "Your review has been submitted successfully",
      });
      
      fetchReviews();
    } catch (error: any) {
      console.error('Error adding review:', error);
      toast({
        title: "Error",
        description: "Failed to add review",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchReviews();
    }
  }, [courseId]);

  return { reviews, loading, addReview, refetch: fetchReviews };
};
