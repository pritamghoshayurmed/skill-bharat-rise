import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useCourses } from "@/hooks/useCourses";
import { useCourseEnrollment } from "@/hooks/useCourseEnrollment";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { useAuth } from "@/hooks/useAuth";
import { CertificateService } from "@/lib/certificateService";
import { CheckCircle, Play, Clock, BookOpen, Award, User, AlertCircle } from "lucide-react";

const TestCompleteFlow = () => {
  const [testCourseId] = useState('aa0457f6-8af6-4148-ab96-e44c10236154'); // Python course
  const [testLessonId] = useState('14d6b65b-e505-4d89-9252-17182ded22a1'); // Python lesson
  const [testResults, setTestResults] = useState<any>({});
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const { user } = useAuth();

  const { courses } = useCourses();
  const { enrollment, enrollInCourse, loading: enrollmentLoading } = useCourseEnrollment(testCourseId);
  const { progressData, loading: progressLoading } = useCourseProgress(testCourseId);
  const { progress: lessonProgress, markAsCompleted, updateProgressPercentage } = useLessonProgress(testLessonId);

  const course = courses.find(c => c.id === testCourseId);

  useEffect(() => {
    // Update test results when data changes
    setTestResults({
      user: user ? { id: user.id, email: user.email } : null,
      course: course ? { id: course.id, title: course.title } : null,
      enrollment: enrollment ? { 
        enrolled: true, 
        progress: enrollment.progress, 
        completed: enrollment.completed 
      } : { enrolled: false },
      courseProgress: progressData ? {
        overall_progress: progressData.overall_progress,
        completed_lessons: progressData.completed_lessons,
        total_lessons: progressData.total_lessons,
        is_completed: progressData.is_completed
      } : null,
      lessonProgress: lessonProgress ? {
        completed: lessonProgress.completed,
        progress_percentage: lessonProgress.progress_percentage,
        time_spent_minutes: lessonProgress.time_spent_minutes
      } : null
    });
  }, [user, course, enrollment, progressData, lessonProgress]);

  const steps = [
    {
      id: 1,
      title: "User Authentication",
      description: "Verify user is logged in",
      test: () => !!user,
      action: null
    },
    {
      id: 2,
      title: "Course Enrollment",
      description: "Enroll in the test course",
      test: () => !!enrollment,
      action: async () => {
        if (!enrollment) {
          await enrollInCourse();
          toast({ title: "Success", description: "Enrolled in course!" });
        }
      }
    },
    {
      id: 3,
      title: "Lesson Progress",
      description: "Update lesson progress to 50%",
      test: () => (lessonProgress?.progress_percentage || 0) >= 50,
      action: async () => {
        await updateProgressPercentage(50);
        toast({ title: "Success", description: "Lesson progress updated to 50%!" });
      }
    },
    {
      id: 4,
      title: "Mark Lesson Complete",
      description: "Mark the lesson as completed",
      test: () => lessonProgress?.completed || false,
      action: async () => {
        await markAsCompleted();
        toast({ title: "Success", description: "Lesson marked as completed!" });
      }
    },
    {
      id: 5,
      title: "Course Completion",
      description: "Verify course is marked as completed",
      test: () => progressData?.is_completed || false,
      action: null
    },
    {
      id: 6,
      title: "Certificate Generation",
      description: "Generate completion certificate",
      test: () => testResults.certificate !== undefined,
      action: async () => {
        if (user && course && progressData?.is_completed) {
          const certificateData = {
            courseId: course.id,
            courseTitle: course.title,
            studentName: user.email?.split('@')[0] || "Student",
            completionDate: new Date().toISOString(),
            instructor: course.instructor || "Instructor",
            category: course.category || "General",
            totalLessons: progressData.total_lessons,
            timeSpent: progressData.time_spent_minutes,
            verificationCode: `TEST-${Date.now()}`
          };

          const result = await CertificateService.generateCertificate(user.id, certificateData);
          if (result.success) {
            setTestResults(prev => ({ ...prev, certificate: result.certificate }));
            toast({ title: "Success", description: "Certificate generated!" });
          } else {
            throw new Error(result.error);
          }
        }
      }
    }
  ];

  const runStep = async (step: any) => {
    if (step.action) {
      try {
        await step.action();
        setCurrentStep(step.id + 1);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || `Failed to complete step: ${step.title}`,
          variant: "destructive"
        });
      }
    } else {
      setCurrentStep(step.id + 1);
    }
  };

  const runAllTests = async () => {
    for (const step of steps) {
      if (!step.test() && step.action) {
        await runStep(step);
        // Wait a bit for state to update
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              Complete Flow Testing
            </CardTitle>
            <p className="text-white/60">
              Test the complete flow from enrollment to certificate generation
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <Button onClick={runAllTests} className="bg-gradient-to-r from-orange-500 to-pink-500">
                Run All Tests
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white"
              >
                Reset Tests
              </Button>
            </div>

            {/* Test Steps */}
            <div className="grid gap-4">
              {steps.map((step) => {
                const isCompleted = step.test();
                const isCurrent = currentStep === step.id;
                
                return (
                  <Card key={step.id} className={`bg-white/5 border ${
                    isCompleted ? 'border-green-500/30' : 
                    isCurrent ? 'border-orange-500/30' : 'border-white/10'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted ? 'bg-green-500/20 text-green-300' :
                            isCurrent ? 'bg-orange-500/20 text-orange-300' :
                            'bg-white/10 text-white/60'
                          }`}>
                            {isCompleted ? <CheckCircle className="w-4 h-4" /> : step.id}
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{step.title}</h4>
                            <p className="text-white/60 text-sm">{step.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={
                            isCompleted ? 'bg-green-500/20 text-green-300' :
                            'bg-orange-500/20 text-orange-300'
                          }>
                            {isCompleted ? 'Passed' : 'Pending'}
                          </Badge>
                          
                          {step.action && !isCompleted && (
                            <Button 
                              size="sm" 
                              onClick={() => runStep(step)}
                              className="bg-orange-600 hover:bg-orange-700"
                            >
                              Run Test
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Test Results */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-white/80 text-sm bg-black/20 p-4 rounded-lg overflow-auto">
                  {JSON.stringify(testResults, null, 2)}
                </pre>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Test Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-white font-semibold">
                      {steps.filter(s => s.test()).length}/{steps.length}
                    </div>
                    <div className="text-white/60 text-sm">Tests Passed</div>
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      {user ? 'Yes' : 'No'}
                    </div>
                    <div className="text-white/60 text-sm">Authenticated</div>
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      {enrollment ? 'Yes' : 'No'}
                    </div>
                    <div className="text-white/60 text-sm">Enrolled</div>
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      {progressData?.is_completed ? 'Yes' : 'No'}
                    </div>
                    <div className="text-white/60 text-sm">Completed</div>
                  </div>
                </div>

                <Progress 
                  value={(steps.filter(s => s.test()).length / steps.length) * 100} 
                  className="h-3" 
                />
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestCompleteFlow;
