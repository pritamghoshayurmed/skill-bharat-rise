import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { CheckCircle, Play, Clock, BookOpen } from "lucide-react";

const TestProgressTracking = () => {
  const [testLessonId, setTestLessonId] = useState('14d6b65b-e505-4d89-9252-17182ded22a1'); // Python lesson
  const [testCourseId, setTestCourseId] = useState('aa0457f6-8af6-4148-ab96-e44c10236154'); // Python course
  const { toast } = useToast();

  const { 
    progress: lessonProgress, 
    loading: lessonLoading, 
    markAsCompleted, 
    updateProgressPercentage,
    updateTimeSpent 
  } = useLessonProgress(testLessonId);

  const { 
    progressData: courseProgress, 
    loading: courseLoading 
  } = useCourseProgress(testCourseId);

  const handleMarkComplete = async () => {
    try {
      await markAsCompleted();
      toast({
        title: "Success!",
        description: "Lesson marked as completed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark lesson as completed",
        variant: "destructive"
      });
    }
  };

  const handleUpdateProgress = async (percentage: number) => {
    try {
      await updateProgressPercentage(percentage);
      toast({
        title: "Success!",
        description: `Progress updated to ${percentage}%`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive"
      });
    }
  };

  const handleAddTime = async () => {
    try {
      await updateTimeSpent(5); // Add 5 minutes
      toast({
        title: "Success!",
        description: "Added 5 minutes to time spent",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update time spent",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Progress Tracking Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Test Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm mb-2 block">Test Lesson ID:</label>
                <Input
                  value={testLessonId}
                  onChange={(e) => setTestLessonId(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Test Course ID:</label>
                <Input
                  value={testCourseId}
                  onChange={(e) => setTestCourseId(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            {/* Lesson Progress Testing */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Lesson Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lessonLoading ? (
                  <div className="text-white/60">Loading lesson progress...</div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-white font-semibold">
                          {lessonProgress?.completed ? 'Completed' : 'Not Completed'}
                        </div>
                        <Badge className={lessonProgress?.completed ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300'}>
                          {lessonProgress?.completed ? <CheckCircle className="w-4 h-4 mr-1" /> : <BookOpen className="w-4 h-4 mr-1" />}
                          Status
                        </Badge>
                      </div>
                      <div>
                        <div className="text-white font-semibold">
                          {lessonProgress?.progress_percentage || 0}%
                        </div>
                        <div className="text-white/60 text-sm">Progress</div>
                      </div>
                      <div>
                        <div className="text-white font-semibold">
                          {lessonProgress?.time_spent_minutes || 0} min
                        </div>
                        <div className="text-white/60 text-sm">Time Spent</div>
                      </div>
                    </div>

                    <Progress value={lessonProgress?.progress_percentage || 0} className="h-2" />

                    <div className="flex gap-2 flex-wrap">
                      <Button onClick={handleMarkComplete} className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Complete
                      </Button>
                      <Button onClick={() => handleUpdateProgress(25)} variant="outline" className="bg-white/10 border-white/20 text-white">
                        25% Progress
                      </Button>
                      <Button onClick={() => handleUpdateProgress(50)} variant="outline" className="bg-white/10 border-white/20 text-white">
                        50% Progress
                      </Button>
                      <Button onClick={() => handleUpdateProgress(75)} variant="outline" className="bg-white/10 border-white/20 text-white">
                        75% Progress
                      </Button>
                      <Button onClick={handleAddTime} variant="outline" className="bg-white/10 border-white/20 text-white">
                        <Clock className="w-4 h-4 mr-2" />
                        +5 min
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Progress Testing */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Course Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {courseLoading ? (
                  <div className="text-white/60">Loading course progress...</div>
                ) : courseProgress ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-white font-semibold">
                          {courseProgress.completed_lessons}/{courseProgress.total_lessons}
                        </div>
                        <div className="text-white/60 text-sm">Lessons</div>
                      </div>
                      <div>
                        <div className="text-white font-semibold">
                          {courseProgress.overall_progress}%
                        </div>
                        <div className="text-white/60 text-sm">Overall</div>
                      </div>
                      <div>
                        <div className="text-white font-semibold">
                          {courseProgress.time_spent_minutes} min
                        </div>
                        <div className="text-white/60 text-sm">Time Spent</div>
                      </div>
                      <div>
                        <div className="text-white font-semibold">
                          {courseProgress.is_completed ? 'Yes' : 'No'}
                        </div>
                        <div className="text-white/60 text-sm">Completed</div>
                      </div>
                    </div>

                    <Progress value={courseProgress.overall_progress} className="h-3" />

                    {courseProgress.modules.map((module, index) => (
                      <div key={module.module_id} className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium">{module.module_title}</h4>
                          <Badge className="bg-blue-500/20 text-blue-300">
                            {module.progress_percentage}%
                          </Badge>
                        </div>
                        <div className="text-white/60 text-sm mb-2">
                          {module.completed_lessons}/{module.total_lessons} lessons completed
                        </div>
                        <Progress value={module.progress_percentage} className="h-1" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-white/60">No course progress data</div>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestProgressTracking;
