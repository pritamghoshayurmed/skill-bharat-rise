
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Lock, CheckCircle, Clock } from "lucide-react";
import { useCourseModules } from "@/hooks/useCourseModules";
import { useCourseLessons } from "@/hooks/useCourseLessons";
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
            <div className="space-y-3">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{lesson.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Clock className="w-3 h-3" />
                        {lesson.duration_minutes} min
                        <span className="capitalize">{lesson.lesson_type}</span>
                      </div>
                    </div>
                  </div>
                  {userEnrolled && (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                    >
                      Start
                    </Button>
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
