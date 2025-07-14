import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { YouTubePlayer, isValidYouTubeUrl, getYouTubeVideoId } from '@/components/YouTubePlayer';
import { useCourses } from '@/hooks/useCourses';
import { Play, Youtube, BookOpen, Users } from 'lucide-react';

const TestCourseFlow = () => {
  const [testUrl, setTestUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { courses, loading: coursesLoading, refetch } = useCourses();

  const testYouTubeIntegration = () => {
    const isValid = isValidYouTubeUrl(testUrl);
    const videoId = getYouTubeVideoId(testUrl);
    
    setTestResults({
      url: testUrl,
      isValid,
      videoId,
      thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
    });

    toast({
      title: isValid ? "Valid YouTube URL" : "Invalid YouTube URL",
      description: isValid ? `Video ID: ${videoId}` : "Please enter a valid YouTube URL",
      variant: isValid ? "default" : "destructive"
    });
  };

  const createTestCourse = async () => {
    setLoading(true);
    try {
      // Create a test course
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          title: 'Test Video Course',
          description: 'A test course with YouTube videos',
          instructor: 'Test Instructor',
          category: 'Programming',
          level: 'Beginner',
          price: 0,
          duration: '2 hours'
        })
        .select()
        .single();

      if (courseError) throw courseError;

      // Create a test module
      const { data: module, error: moduleError } = await supabase
        .from('course_modules')
        .insert({
          course_id: course.id,
          title: 'Introduction Module',
          description: 'Getting started with the course',
          order_index: 1,
          duration_minutes: 30
        })
        .select()
        .single();

      if (moduleError) throw moduleError;

      // Create test lessons
      const lessons = [
        {
          module_id: module.id,
          title: 'Welcome Video',
          content: 'Introduction to the course',
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration_minutes: 5,
          order_index: 1,
          lesson_type: 'video',
          is_preview: true
        },
        {
          module_id: module.id,
          title: 'Course Overview',
          content: 'What you will learn in this course',
          video_url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
          duration_minutes: 10,
          order_index: 2,
          lesson_type: 'video',
          is_preview: false
        }
      ];

      const { error: lessonsError } = await supabase
        .from('course_lessons')
        .insert(lessons);

      if (lessonsError) throw lessonsError;

      toast({
        title: "Test Course Created!",
        description: `Course "${course.title}" created with video lessons`,
      });

      refetch();
    } catch (error: any) {
      console.error('Error creating test course:', error);
      toast({
        title: "Error",
        description: "Failed to create test course",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testDatabaseFunctions = async () => {
    setLoading(true);
    try {
      // Test YouTube ID extraction function
      const { data: extractResult, error: extractError } = await supabase
        .rpc('extract_youtube_id', { video_url: testUrl });

      if (extractError) throw extractError;

      // Test thumbnail generation function
      const { data: thumbnailResult, error: thumbnailError } = await supabase
        .rpc('generate_youtube_thumbnail', { video_id: extractResult });

      if (thumbnailError) throw thumbnailError;

      toast({
        title: "Database Functions Working!",
        description: `Extracted ID: ${extractResult}`,
      });

      setTestResults({
        ...testResults,
        dbExtractedId: extractResult,
        dbThumbnail: thumbnailResult
      });
    } catch (error: any) {
      console.error('Database function test failed:', error);
      toast({
        title: "Database Test Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-2">
              <Youtube className="w-6 h-6" />
              Course Management System Tests
            </CardTitle>
            <p className="text-white/70">
              Test the complete course creation and video playback functionality
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* YouTube URL Testing */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold">YouTube Integration Test</h3>
              <div className="flex gap-2">
                <Input
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  placeholder="Enter YouTube URL..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Button onClick={testYouTubeIntegration} variant="outline" className="bg-white/10 border-white/20 text-white">
                  Test URL
                </Button>
                <Button onClick={testDatabaseFunctions} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  Test DB Functions
                </Button>
              </div>

              {testResults && (
                <div className="grid gap-4">
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="text-white font-medium mb-2">Test Results:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/70">URL Valid:</span>
                        <Badge variant={testResults.isValid ? "default" : "destructive"}>
                          {testResults.isValid ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Video ID:</span>
                        <span className="text-white">{testResults.videoId || "N/A"}</span>
                      </div>
                      {testResults.dbExtractedId && (
                        <div className="flex justify-between">
                          <span className="text-white/70">DB Extracted ID:</span>
                          <span className="text-white">{testResults.dbExtractedId}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {testResults.isValid && (
                    <YouTubePlayer
                      videoUrl={testResults.url}
                      title="Test Video"
                      className="max-w-md"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Course Creation Test */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold">Course Creation Test</h3>
              <Button 
                onClick={createTestCourse}
                disabled={loading}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {loading ? "Creating..." : "Create Test Course"}
              </Button>
            </div>

            {/* Existing Courses */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold">Existing Courses</h3>
              {coursesLoading ? (
                <div className="text-white/60">Loading courses...</div>
              ) : courses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No courses found</p>
                  <p className="text-white/40 text-sm">Create a test course to get started</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {courses.slice(0, 5).map((course) => (
                    <div key={course.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">{course.title}</h4>
                          <p className="text-white/60 text-sm">{course.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">{course.category}</Badge>
                            <Badge variant="outline">{course.level}</Badge>
                            <span className="text-white/60 text-xs flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {course.students_enrolled} enrolled
                            </span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white">
                          <Play className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">Testing Instructions:</h4>
              <ol className="text-blue-300/80 text-sm space-y-1 list-decimal list-inside">
                <li>First, apply the database migration in Supabase SQL editor</li>
                <li>Test YouTube URL validation and video ID extraction</li>
                <li>Create a test course with video lessons</li>
                <li>Navigate to /company-dashboard to create courses manually</li>
                <li>Check /courses page to see real course data</li>
                <li>Test video playback in course detail pages</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestCourseFlow;
