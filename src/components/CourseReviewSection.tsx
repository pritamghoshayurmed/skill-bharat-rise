
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useCourseReviews } from "@/hooks/useCourseReviews";
import { useAuth } from "@/hooks/useAuth";

interface CourseReviewSectionProps {
  courseId: string;
  userEnrolled: boolean;
}

export const CourseReviewSection = ({ courseId, userEnrolled }: CourseReviewSectionProps) => {
  const { reviews, loading, addReview } = useCourseReviews(courseId);
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!user) return;
    
    setSubmitting(true);
    await addReview(rating, reviewText);
    setSubmitting(false);
    setShowReviewForm(false);
    setReviewText("");
    setRating(5);
  };

  if (loading) {
    return <div className="text-white">Loading reviews...</div>;
  }

  const userHasReviewed = reviews.some(review => review.user_id === user?.id);

  return (
    <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Student Reviews</CardTitle>
          {userEnrolled && !userHasReviewed && (
            <Button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              Write Review
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {showReviewForm && (
          <div className="p-4 bg-white/5 rounded-lg space-y-4">
            <div>
              <label className="text-white text-sm mb-2 block">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-colors"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? "text-yellow-400 fill-current"
                          : "text-white/40"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-white text-sm mb-2 block">Review (Optional)</label>
              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this course..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
              <Button
                onClick={() => setShowReviewForm(false)}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            No reviews yet. Be the first to review this course!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-white/10 pb-4 last:border-b-0">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {review.full_name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-white">
                        {review.full_name || 'Anonymous Student'}
                      </span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-white/40"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.review_text && (
                      <p className="text-white/80">{review.review_text}</p>
                    )}
                    <p className="text-white/60 text-sm mt-2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
