
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, Lock, CheckCircle, Clock, Youtube, ChevronDown, ChevronUp, Download, BookOpen } from "lucide-react";
import { useCourseModules } from "@/hooks/useCourseModules";
import { useCourseLessons } from "@/hooks/useCourseLessons";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { useState, useEffect, useRef } from "react";

interface CourseModuleListProps {
  courseId: string;
  userEnrolled: boolean;
}

export const CourseModuleList = ({ courseId, userEnrolled }: CourseModuleListProps) => {
  const { modules, loading } = useCourseModules(courseId);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("lectures");

  // Auto-expand first module and select first lesson on load
  useEffect(() => {
    if (modules.length > 0 && !selectedLesson) {
      const firstModule = modules[0];
      setExpandedModules(new Set([firstModule.id]));
    }
  }, [modules, selectedLesson]);

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleLessonSelect = (lesson: any) => {
    setSelectedLesson(lesson);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-white/60">Loading course modules...</div>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-white/60">No modules available for this course.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Video Player Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Video Player */}
        <div className="lg:col-span-2">
          <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
            <CardContent className="p-0">
              {selectedLesson && selectedLesson.video_url ? (
                <div className="aspect-video">
                  <YouTubePlayer
                    videoUrl={selectedLesson.video_url}
                    title={selectedLesson.title}
                    className="w-full h-full rounded-lg"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <Youtube className="w-16 h-16 mx-auto mb-4 text-white/40" />
                    <h3 className="text-xl font-semibold mb-2">Select a Lesson</h3>
                    <p className="text-white/60">Choose a lesson from the modules below to start learning</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lesson Info and Actions */}
          {selectedLesson && (
            <LessonInfoCard
              lesson={selectedLesson}
              userEnrolled={userEnrolled}
              onMarkComplete={() => {
                // Refresh lesson data after completion
                setSelectedLesson({...selectedLesson});
              }}
            />
          )}
        </div>

        {/* Course Content Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-black/40 backdrop-blur-xl border border-white/10 sticky top-6">
            <CardHeader>
              <div className="flex space-x-1 bg-black/20 rounded-lg p-1">
                {[
                  { key: "lectures", label: "Lectures", icon: BookOpen },
                  { key: "resources", label: "Resources", icon: Download }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        activeTab === tab.key
                          ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </CardHeader>

            <CardContent className="max-h-[70vh] overflow-y-auto">
              {activeTab === "lectures" && (
                <div className="space-y-4">
                  {modules.map((module, moduleIndex) => (
                    <ModuleSection
                      key={module.id}
                      module={module}
                      moduleIndex={moduleIndex}
                      isExpanded={expandedModules.has(module.id)}
                      onToggle={() => toggleModule(module.id)}
                      onLessonSelect={handleLessonSelect}
                      selectedLessonId={selectedLesson?.id}
                      userEnrolled={userEnrolled}
                    />
                  ))}
                </div>
              )}

              {activeTab === "resources" && (
                <div className="text-center py-8">
                  <Download className="w-12 h-12 mx-auto mb-4 text-white/40" />
                  <p className="text-white/60">Course resources will be available here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Lesson Info Card Component
interface LessonInfoCardProps {
  lesson: any;
  userEnrolled: boolean;
  onMarkComplete: () => void;
}

const LessonInfoCard = ({ lesson, userEnrolled, onMarkComplete }: LessonInfoCardProps) => {
  const {
    progress,
    markAsCompleted,
    updateProgressPercentage,
    updateTimeSpent,
    loading
  } = useLessonProgress(lesson.id);

  const [watchStartTime, setWatchStartTime] = useState<Date | null>(null);
  const timeTrackingRef = useRef<NodeJS.Timeout | null>(null);

  const isCompleted = progress?.completed || false;
  const progressPercentage = progress?.progress_percentage || 0;
  const timeSpent = progress?.time_spent_minutes || 0;

  // Start time tracking when lesson is selected
  useEffect(() => {
    if (userEnrolled && lesson) {
      setWatchStartTime(new Date());

      // Track time spent every minute
      timeTrackingRef.current = setInterval(() => {
        if (watchStartTime) {
          const now = new Date();
          const minutesSpent = Math.floor((now.getTime() - watchStartTime.getTime()) / 60000);
          if (minutesSpent > 0) {
            updateTimeSpent(minutesSpent);
            setWatchStartTime(now); // Reset to avoid double counting
          }
        }
      }, 60000);

      return () => {
        if (timeTrackingRef.current) {
          clearInterval(timeTrackingRef.current);
        }
      };
    }
  }, [lesson, userEnrolled, updateTimeSpent, watchStartTime]);

  const handleMarkComplete = async () => {
    if (userEnrolled && !isCompleted) {
      await markAsCompleted();
      onMarkComplete();
    }
  };

  const handleProgressUpdate = async (percentage: number) => {
    if (userEnrolled && percentage > progressPercentage) {
      await updateProgressPercentage(percentage);
    }
  };

  // Auto-update progress to 50% after 30 seconds of viewing
  useEffect(() => {
    if (userEnrolled && !isCompleted && progressPercentage < 50) {
      const timer = setTimeout(() => {
        handleProgressUpdate(50);
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, [lesson, userEnrolled, isCompleted, progressPercentage]);

  return (
    <Card className="bg-black/40 backdrop-blur-xl border border-white/10 mt-4">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {isCompleted ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <BookOpen className="w-6 h-6 text-orange-400" />
            )}
            <div>
              <h3 className="text-white text-lg font-semibold">{lesson.title}</h3>
              <div className="flex items-center gap-4 text-sm text-white/60 mt-1">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{lesson.duration_minutes} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Youtube className="w-4 h-4" />
                  <span>Video Lesson</span>
                </div>
                {timeSpent > 0 && (
                  <div className="flex items-center gap-1">
                    <span>Watched: {timeSpent} min</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {userEnrolled && !isCompleted && (
            <Button
              onClick={handleMarkComplete}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {loading ? "Marking..." : "Mark as Complete"}
            </Button>
          )}

          {isCompleted && (
            <Badge className="bg-green-500/20 text-green-300 border-0">
              Completed
            </Badge>
          )}
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

        {lesson.content && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <h4 className="text-white font-medium mb-2">Lesson Description</h4>
            <div className="text-white/80 text-sm">
              <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Module Section Component
interface ModuleSectionProps {
  module: any;
  moduleIndex: number;
  userEnrolled: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onLessonSelect: (lesson: any) => void;
  selectedLessonId?: string;
}

const ModuleSection = ({
  module,
  moduleIndex,
  userEnrolled,
  isExpanded,
  onToggle,
  onLessonSelect,
  selectedLessonId
}: ModuleSectionProps) => {
  const { lessons, loading } = useCourseLessons(isExpanded ? module.id : '');

  // Calculate module progress
  const [moduleProgress, setModuleProgress] = useState({ completed: 0, total: 0 });

  useEffect(() => {
    if (lessons.length > 0 && userEnrolled) {
      // This would be calculated from lesson progress in a real implementation
      // For now, we'll use a placeholder
      setModuleProgress({ completed: 0, total: lessons.length });
    }
  }, [lessons, userEnrolled]);

  const progressPercentage = moduleProgress.total > 0 ? Math.round((moduleProgress.completed / moduleProgress.total) * 100) : 0;
  const isModuleCompleted = progressPercentage === 100;

  return (
    <div className="border border-white/10 rounded-lg bg-white/5">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Module Number */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              isModuleCompleted
                ? 'bg-green-500/20 text-green-300 border-2 border-green-500/30'
                : module.is_locked && !userEnrolled
                ? 'bg-white/5 text-white/40 border-2 border-white/10'
                : 'bg-orange-500/20 text-orange-300 border-2 border-orange-500/30'
            }`}>
              {isModuleCompleted ? (
                <CheckCircle className="w-4 h-4" />
              ) : module.is_locked && !userEnrolled ? (
                <Lock className="w-3 h-3" />
              ) : (
                moduleIndex + 1
              )}
            </div>

            {/* Module Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-white font-medium">{module.title}</h4>
                {isModuleCompleted && (
                  <Badge className="bg-green-500/20 text-green-300 border-0 text-xs">
                    Completed
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-white/60">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{module.duration_minutes} min</span>
                </div>
                {lessons.length > 0 && (
                  <span>{lessons.length} lesson{lessons.length !== 1 ? 's' : ''}</span>
                )}
              </div>

              {/* Progress Bar */}
              {userEnrolled && moduleProgress.total > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                    <span>Progress</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-1" />
                </div>
              )}
            </div>
          </div>

          {/* Expand/Collapse Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onToggle}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex-shrink-0"
            disabled={module.is_locked && !userEnrolled}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-white/10">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="text-white/60">Loading lessons...</div>
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-4">
              <div className="text-white/60">No lessons available in this module.</div>
            </div>
          ) : (
            <div className="space-y-0">
              {lessons.map((lesson, index) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  lessonIndex={index}
                  userEnrolled={userEnrolled}
                  isSelected={selectedLessonId === lesson.id}
                  onSelect={() => onLessonSelect(lesson)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Lesson Item Component for Sidebar
interface LessonItemProps {
  lesson: any;
  lessonIndex: number;
  userEnrolled: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

const LessonItem = ({ lesson, lessonIndex, userEnrolled, isSelected, onSelect }: LessonItemProps) => {
  const { progress, markAsCompleted, loading } = useLessonProgress(lesson.id);
  const isCompleted = progress?.completed || false;
  const canAccess = userEnrolled || lesson.is_preview;

  const handleMarkComplete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent lesson selection
    if (userEnrolled && !isCompleted) {
      await markAsCompleted();
    }
  };

  return (
    <div className={`w-full transition-colors flex items-center gap-3 border-b border-white/5 last:border-b-0 ${
      isSelected
        ? 'bg-orange-500/20 border-l-4 border-orange-500'
        : canAccess
        ? 'hover:bg-white/5'
        : 'opacity-50'
    }`}>
      <button
        onClick={canAccess ? onSelect : undefined}
        disabled={!canAccess}
        className="flex-1 p-3 text-left flex items-center gap-3"
      >
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
          isCompleted
            ? 'bg-green-500/20 text-green-300'
            : canAccess
            ? 'bg-white/10 text-white/80'
            : 'bg-white/5 text-white/40'
        }`}>
          {isCompleted ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            lessonIndex + 1
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-white text-sm font-medium truncate">{lesson.title}</p>
            {lesson.is_preview && (
              <Badge variant="outline" className="border-blue-400/30 text-blue-300 text-xs flex-shrink-0">
                Preview
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-white/60">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{lesson.duration_minutes} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Youtube className="w-3 h-3" />
              <span>Video</span>
            </div>
          </div>
        </div>

        {isSelected && (
          <div className="flex-shrink-0">
            <Play className="w-4 h-4 text-orange-400" />
          </div>
        )}
      </button>

      {/* Quick Mark Complete Button */}
      {userEnrolled && canAccess && !isCompleted && (
        <div className="pr-3">
          <Button
            size="sm"
            variant="outline"
            onClick={handleMarkComplete}
            disabled={loading}
            className="bg-white/10 border-white/20 text-white hover:bg-green-600 hover:border-green-600 h-6 w-6 p-0"
            title="Mark as complete"
          >
            {loading ? (
              <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <CheckCircle className="w-3 h-3" />
            )}
          </Button>
        </div>
      )}

      {/* Completed Indicator */}
      {isCompleted && (
        <div className="pr-3">
          <CheckCircle className="w-4 h-4 text-green-400" />
        </div>
      )}
    </div>
  );
};
