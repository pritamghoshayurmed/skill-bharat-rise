
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, Lock, CheckCircle, Clock, Youtube } from "lucide-react";
import { useCourseModules } from "@/hooks/useCourseModules";
import { useCourseLessons } from "@/hooks/useCourseLessons";
import { YouTubePlayer } from "./YouTubePlayer";
import { useState } from "react";

interface CourseModuleListProps {
  courseId: string;
  userEnrolled: boolean;
}

export const CourseModuleList = ({ courseId, userEnrolled }: CourseModuleListProps) => {
  const { modules, loading } = useCourseModules(courseId);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  if (loading) {
    return <div className="text-white">Loading modules...</div>;
  }

  return (
    <div className="space-y-4">
      {modules.map((module) => (
        <ModuleCard 
          key={module.id} 
          module={module} 
          userEnrolled={userEnrolled}
          isExpanded={expandedModule === module.id}
          onToggle={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
        />
      ))}
    </div>
  );
};

interface ModuleCardProps {
  module: any;
  userEnrolled: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

const ModuleCard = ({ module, userEnrolled, isExpanded, onToggle }: ModuleCardProps) => {
  const { lessons, loading } = useCourseLessons(isExpanded ? module.id : '');
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  return (
    <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {module.is_locked && !userEnrolled ? (
              <Lock className="w-5 h-5 text-white/40" />
            ) : (
              <Play className="w-5 h-5 text-orange-400" />
            )}
            <div>
              <CardTitle className="text-white">{module.title}</CardTitle>
              <p className="text-white/60 text-sm mt-1">{module.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {module.duration_minutes} minutes
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggle}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            disabled={module.is_locked && !userEnrolled}
          >
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          {loading ? (
            <div className="text-white/60">Loading lessons...</div>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{lesson.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.duration_minutes} min
                          </div>
                          <div className="flex items-center gap-1">
                            {lesson.lesson_type === 'video' ? (
                              <>
                                <Youtube className="w-3 h-3" />
                                <span>Video</span>
                              </>
                            ) : (
                              <span className="capitalize">{lesson.lesson_type}</span>
                            )}
                          </div>
                          {lesson.is_preview && (
                            <Badge variant="secondary" className="text-xs">
                              Preview
                            </Badge>
                          )}
                        </div>
                        {lesson.content && (
                          <p className="text-white/50 text-sm mt-1">{lesson.content}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Debug info - remove after testing */}
                      <div className="text-xs text-white/50 mr-2">
                        Enrolled: {userEnrolled ? 'Yes' : 'No'} |
                        Preview: {lesson.is_preview ? 'Yes' : 'No'} |
                        Video: {lesson.video_url ? 'Yes' : 'No'}
                      </div>

                      {(userEnrolled || lesson.is_preview || true) && lesson.video_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            console.log('Watch button clicked for lesson:', lesson.id, 'Video URL:', lesson.video_url);
                            setSelectedLesson(selectedLesson === lesson.id ? null : lesson.id);
                          }}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          {selectedLesson === lesson.id ? "Hide" : "Watch"}
                        </Button>
                      )}
                      {userEnrolled && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Start
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Video Player */}
                  {selectedLesson === lesson.id && lesson.video_url && (userEnrolled || lesson.is_preview || true) && (
                    <div className="ml-11">
                      <div className="text-xs text-white/50 mb-2">
                        Debug: Playing lesson {lesson.id} - {lesson.video_url}
                      </div>
                      <YouTubePlayer
                        videoUrl={lesson.video_url}
                        title={lesson.title}
                        className="max-w-2xl"
                      />
                    </div>
                  )}

                  {/* Debug: Show why video player is not showing */}
                  {selectedLesson === lesson.id && (
                    <div className="ml-11 text-xs text-red-400 mt-2">
                      {!lesson.video_url && "No video URL"}
                      {lesson.video_url && !(userEnrolled || lesson.is_preview) && "Not enrolled and not preview"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
