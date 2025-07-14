import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Target, 
  TrendingUp,
  Award,
  PlayCircle
} from "lucide-react";
import { CourseProgressData } from "@/hooks/useCourseProgress";

interface CourseProgressDashboardProps {
  progressData: CourseProgressData;
  isEnrolled: boolean;
}

export const CourseProgressDashboard: React.FC<CourseProgressDashboardProps> = ({
  progressData,
  isEnrolled
}) => {
  if (!isEnrolled) {
    return null;
  }

  const {
    overall_progress,
    completed_lessons,
    total_lessons,
    time_spent_minutes,
    total_duration_minutes,
    modules,
    is_completed
  } = progressData;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return 'text-green-400';
    if (percentage >= 75) return 'text-blue-400';
    if (percentage >= 50) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getProgressBgColor = (percentage: number) => {
    if (percentage === 100) return 'bg-green-500/20';
    if (percentage >= 75) return 'bg-blue-500/20';
    if (percentage >= 50) return 'bg-yellow-500/20';
    return 'bg-orange-500/20';
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress Card */}
      <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Overall Completion</span>
              <div className="flex items-center gap-2">
                {is_completed && <CheckCircle className="w-5 h-5 text-green-400" />}
                <span className={`font-bold text-lg ${getProgressColor(overall_progress)}`}>
                  {overall_progress}%
                </span>
              </div>
            </div>
            <Progress value={overall_progress} className="h-3" />
            {is_completed && (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <Award className="w-4 h-4" />
                <span>Congratulations! Course completed!</span>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-white font-bold text-xl">{completed_lessons}</div>
              <div className="text-white/60 text-sm">Lessons Done</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-white font-bold text-xl">{total_lessons}</div>
              <div className="text-white/60 text-sm">Total Lessons</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-white font-bold text-xl">{formatTime(time_spent_minutes)}</div>
              <div className="text-white/60 text-sm">Time Spent</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-white font-bold text-xl">{modules.length}</div>
              <div className="text-white/60 text-sm">Modules</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Progress */}
      <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-400" />
            Module Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modules.map((module, index) => (
              <div key={module.module_id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      module.progress_percentage === 100 
                        ? 'bg-green-500/20 text-green-300 border-2 border-green-500/30' 
                        : module.progress_percentage > 0
                        ? 'bg-orange-500/20 text-orange-300 border-2 border-orange-500/30'
                        : 'bg-white/5 text-white/40 border-2 border-white/10'
                    }`}>
                      {module.progress_percentage === 100 ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{module.module_title}</h4>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span>{module.completed_lessons}/{module.total_lessons} lessons</span>
                        <span>{formatTime(module.total_duration_minutes)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getProgressBgColor(module.progress_percentage)} ${getProgressColor(module.progress_percentage)} border-0`}>
                      {module.progress_percentage}%
                    </Badge>
                  </div>
                </div>
                <Progress value={module.progress_percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Insights */}
      <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-400" />
            Learning Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-white font-medium">Study Time</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Time invested:</span>
                  <span className="text-white">{formatTime(time_spent_minutes)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Estimated total:</span>
                  <span className="text-white">{formatTime(total_duration_minutes)}</span>
                </div>
                {total_duration_minutes > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Time efficiency:</span>
                    <span className="text-white">
                      {Math.round((time_spent_minutes / total_duration_minutes) * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-white font-medium">Achievement</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Completion rate:</span>
                  <span className="text-white">{overall_progress}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Lessons remaining:</span>
                  <span className="text-white">{total_lessons - completed_lessons}</span>
                </div>
                {!is_completed && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Next milestone:</span>
                    <span className="text-white">
                      {overall_progress < 25 ? '25%' : 
                       overall_progress < 50 ? '50%' : 
                       overall_progress < 75 ? '75%' : '100%'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
