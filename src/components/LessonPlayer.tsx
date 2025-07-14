import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Download,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { CourseLesson } from "@/hooks/useCourseLessons";

interface LessonPlayerProps {
  lesson: CourseLesson;
  onComplete?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  userEnrolled?: boolean;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  lesson,
  onComplete,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
  userEnrolled = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeTrackingRef = useRef<NodeJS.Timeout | null>(null);

  const { 
    progress, 
    loading: progressLoading, 
    markAsCompleted, 
    updateTimeSpent, 
    updateProgressPercentage 
  } = useLessonProgress(lesson.id);

  const isCompleted = progress?.completed || false;
  const progressPercentage = progress?.progress_percentage || 0;
  const timeSpent = progress?.time_spent_minutes || 0;

  // Track time spent on lesson
  useEffect(() => {
    if (isPlaying && userEnrolled) {
      setStartTime(new Date());
      
      timeTrackingRef.current = setInterval(() => {
        if (startTime) {
          const now = new Date();
          const minutesSpent = Math.floor((now.getTime() - startTime.getTime()) / 60000);
          if (minutesSpent > 0) {
            updateTimeSpent(minutesSpent);
            setStartTime(now); // Reset start time to avoid double counting
          }
        }
      }, 60000); // Update every minute

      return () => {
        if (timeTrackingRef.current) {
          clearInterval(timeTrackingRef.current);
        }
      };
    }
  }, [isPlaying, startTime, updateTimeSpent, userEnrolled]);

  // Update progress based on video progress
  useEffect(() => {
    if (duration > 0 && currentTime > 0 && userEnrolled) {
      const videoProgress = Math.floor((currentTime / duration) * 100);
      if (videoProgress > progressPercentage) {
        updateProgressPercentage(videoProgress);
      }
    }
  }, [currentTime, duration, progressPercentage, updateProgressPercentage, userEnrolled]);

  const handlePlayPause = () => {
    if (!userEnrolled && !lesson.is_preview) {
      return;
    }

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleMarkComplete = async () => {
    if (userEnrolled) {
      await markAsCompleted();
      onComplete?.();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const canAccess = userEnrolled || lesson.is_preview;

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <BookOpen className="w-6 h-6 text-orange-400" />
                )}
                <CardTitle className="text-white text-xl">{lesson.title}</CardTitle>
              </div>
              {isCompleted && (
                <Badge className="bg-green-500/20 text-green-300 border-0">
                  Completed
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-white/60">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{lesson.duration_minutes} min</span>
              </div>
              {timeSpent > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-sm">Time spent: {timeSpent} min</span>
                </div>
              )}
            </div>
          </div>
          
          {userEnrolled && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-white/60">
                <span>Progress</span>
                <span>{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Video Player */}
      {lesson.video_url && (
        <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
          <CardContent className="p-0">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {canAccess ? (
                <video
                  ref={videoRef}
                  src={lesson.video_url}
                  className="w-full h-full"
                  onTimeUpdate={handleVideoTimeUpdate}
                  onLoadedMetadata={handleVideoLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  controls
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Enroll to Access</h3>
                    <p className="text-white/60">This lesson requires course enrollment</p>
                  </div>
                </div>
              )}
            </div>
            
            {canAccess && duration > 0 && (
              <div className="p-4 bg-black/20">
                <div className="flex items-center justify-between text-white/80 text-sm">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <Progress 
                  value={(currentTime / duration) * 100} 
                  className="h-1 mt-2" 
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lesson Content */}
      {lesson.content && (
        <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Lesson Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-white/80 prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous Lesson
        </Button>

        <div className="flex items-center gap-3">
          {userEnrolled && !isCompleted && (
            <Button
              onClick={handleMarkComplete}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Complete
            </Button>
          )}
          
          <Button
            onClick={onNext}
            disabled={!hasNext}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            Next Lesson
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
