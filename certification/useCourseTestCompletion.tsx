import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface CourseTest {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  questions: any[];
  passing_score: number;
  time_limit_minutes: number | null;
  max_attempts: number;
  is_active: boolean;
}

export interface TestResult {
  test_id: string;
  score: number;
  passed: boolean;
  attempt_number: number;
  completed_at: string | null;
  max_attempts: number;
  passing_score: number;
}

export interface CourseTestStatus {
  canTakeTest: boolean;
  hasPassedTest: boolean;
  testExists: boolean;
  courseCompleted: boolean;
  testResult: TestResult | null;
  test: CourseTest | null;
}

export const useCourseTestCompletion = (courseId: string) => {
  const [testStatus, setTestStatus] = useState<CourseTestStatus>({
    canTakeTest: false,
    hasPassedTest: false,
    testExists: false,
    courseCompleted: false,
    testResult: null,
    test: null
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTestStatus = async () => {
    if (!user || !courseId) {
      setLoading(false);
      return;
    }

    try {
      // Check if course is completed
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .select('completed, progress')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (enrollmentError) throw enrollmentError;

      const courseCompleted = enrollment?.completed && (enrollment?.progress || 0) >= 100;

      // Get course test if it exists
      const { data: test, error: testError } = await supabase
        .from('course_tests')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_active', true)
        .maybeSingle();

      if (testError) throw testError;

      let canTakeTest = false;
      let hasPassedTest = false;
      let testResult: TestResult | null = null;

      if (test) {
        // Check if user can take the test
        const { data: canTake, error: canTakeError } = await supabase
          .rpc('can_take_course_test', {
            p_user_id: user.id,
            p_course_id: courseId
          });

        if (canTakeError) throw canTakeError;
        canTakeTest = canTake;

        // Check if user has passed the test
        const { data: passed, error: passedError } = await supabase
          .rpc('has_passed_course_test', {
            p_user_id: user.id,
            p_course_id: courseId
          });

        if (passedError) throw passedError;
        hasPassedTest = passed;

        // Get user's best test result
        const { data: bestResult, error: resultError } = await supabase
          .rpc('get_user_best_test_result', {
            p_user_id: user.id,
            p_course_id: courseId
          });

        if (resultError) throw resultError;
        
        if (bestResult && bestResult.length > 0) {
          testResult = bestResult[0];
        }
      } else {
        // No test exists, so user has "passed" by default if course is completed
        hasPassedTest = courseCompleted;
        canTakeTest = false;
      }

      setTestStatus({
        canTakeTest,
        hasPassedTest,
        testExists: !!test,
        courseCompleted,
        testResult,
        test
      });

    } catch (error: any) {
      console.error('Error fetching test status:', error);
      toast({
        title: "Error",
        description: "Failed to load test status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const submitTestResult = async (answers: Record<string, any>, score: number) => {
    if (!user || !testStatus.test) {
      throw new Error('User not authenticated or test not found');
    }

    try {
      // Get current attempt number
      const { data: existingResults, error: countError } = await supabase
        .from('course_test_results')
        .select('attempt_number')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('test_id', testStatus.test.id)
        .order('attempt_number', { ascending: false })
        .limit(1);

      if (countError) throw countError;

      const nextAttemptNumber = existingResults && existingResults.length > 0 
        ? existingResults[0].attempt_number + 1 
        : 1;

      const passed = score >= testStatus.test.passing_score;

      // Insert test result
      const { error: insertError } = await supabase
        .from('course_test_results')
        .insert({
          test_id: testStatus.test.id,
          user_id: user.id,
          course_id: courseId,
          score,
          answers,
          passed,
          attempt_number: nextAttemptNumber,
          completed_at: new Date().toISOString()
        });

      if (insertError) throw insertError;

      toast({
        title: passed ? "Test Passed!" : "Test Completed",
        description: passed 
          ? `Congratulations! You scored ${score}% and can now generate your certificate.`
          : `You scored ${score}%. You need ${testStatus.test.passing_score}% to pass.`,
        variant: passed ? "default" : "destructive"
      });

      // Refresh test status
      await fetchTestStatus();

      return { success: true, passed, score };

    } catch (error: any) {
      console.error('Error submitting test result:', error);
      toast({
        title: "Error",
        description: "Failed to submit test result",
        variant: "destructive"
      });
      throw error;
    }
  };

  const getTestQuestions = () => {
    return testStatus.test?.questions || [];
  };

  const getRemainingAttempts = () => {
    if (!testStatus.test || !testStatus.testResult) {
      return testStatus.test?.max_attempts || 0;
    }
    return Math.max(0, testStatus.test.max_attempts - testStatus.testResult.attempt_number);
  };

  const getTestStatusMessage = () => {
    if (!testStatus.courseCompleted) {
      return "Complete all course lessons to unlock the test";
    }
    
    if (!testStatus.testExists) {
      return "No test required for this course";
    }
    
    if (testStatus.hasPassedTest) {
      return "Test passed! You can now generate your certificate";
    }
    
    if (!testStatus.canTakeTest) {
      return "Maximum test attempts reached";
    }
    
    return "Test available - click to start";
  };

  useEffect(() => {
    fetchTestStatus();
  }, [user, courseId]);

  return {
    testStatus,
    loading,
    submitTestResult,
    getTestQuestions,
    getRemainingAttempts,
    getTestStatusMessage,
    refetch: fetchTestStatus
  };
};
