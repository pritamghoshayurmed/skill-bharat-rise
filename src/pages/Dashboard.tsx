
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Trophy, Briefcase, User, Clock, Star, ArrowRight, Play, Youtube, Brain, Search, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserEnrollments } from "@/hooks/useUserEnrollments";
import { useAuth } from "@/hooks/useAuth";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { useAchievements } from "@/hooks/useAchievements";
import { useStudentStats } from "@/hooks/useStudentStats";
import { JobSearchAgent } from "@/components/JobSearchAgent";
import { LearningTutor } from "@/components/LearningTutor";
import { InterviewQuestionsManager } from "@/components/InterviewQuestionsManager";

const Dashboard = () => {
  const { user } = useAuth();
  const { enrollments, loading: enrollmentsLoading } = useUserEnrollments();
  const { achievements, loading: achievementsLoading } = useAchievements();
  const { stats: studentStats, loading: statsLoading } = useStudentStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Student!</h1>
            <p className="text-white/70">Continue your learning journey</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/courses">
              <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium shadow-lg border-0">
                Browse Courses
              </Button>
            </Link>
            <Link to="/profile">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* AI Features Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-black/20 border border-white/10 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
              <User className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="job-search" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
              <Search className="w-4 h-4 mr-2" />
              AI Job Search
            </TabsTrigger>
            <TabsTrigger value="tutor" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
              <GraduationCap className="w-4 h-4 mr-2" />
              AI Tutor
            </TabsTrigger>
            <TabsTrigger value="interview-prep" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
              <Brain className="w-4 h-4 mr-2" />
              Interview Prep
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Courses Enrolled</p>
                  <p className="text-3xl font-bold text-white">{enrollments?.length || 0}</p>
                </div>
                <BookOpen className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/50 to-teal-900/50 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Completed</p>
                  <p className="text-3xl font-bold text-white">
                    {statsLoading ? "..." : studentStats.completedCourses}
                  </p>
                </div>
                <Trophy className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/50 to-red-900/50 border-orange-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Certificates</p>
                  <p className="text-3xl font-bold text-white">
                    {statsLoading ? "..." : studentStats.totalCertificates}
                  </p>
                </div>
                <Star className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-900/50 to-purple-900/50 border-pink-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Job Applications</p>
                  <p className="text-3xl font-bold text-white">
                    {statsLoading ? "..." : studentStats.jobApplications}
                  </p>
                </div>
                <Briefcase className="w-8 h-8 text-pink-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <div className="lg:col-span-2">
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Continue Learning</CardTitle>
                    <CardDescription className="text-white/70">
                      Pick up where you left off
                    </CardDescription>
                  </div>
                  <Link to="/courses">
                    <Button 
                      variant="outline" 
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm"
                    >
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrollmentsLoading ? (
                  <div className="text-white/60">Loading your courses...</div>
                ) : !enrollments || enrollments.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">No enrolled courses yet</p>
                    <p className="text-white/40 text-sm">Start learning by enrolling in a course</p>
                    <Link to="/courses">
                      <Button className="mt-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                        Browse Courses
                      </Button>
                    </Link>
                  </div>
                ) : (
                  (enrollments || []).slice(0, 3).map((enrollment) => (
                    <div key={enrollment.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-white font-semibold">{enrollment.course?.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="bg-white/20 text-white/90 border border-white/30">
                              {enrollment.course?.category || 'Course'}
                            </Badge>
                            <span className="text-white/60 text-sm flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {enrollment.course?.duration || 'Self-paced'}
                            </span>
                            {enrollment.completed && (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link to={`/courses/${enrollment.course_id}`}>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium shadow-lg border-0"
                            >
                              <Play className="w-4 h-4 mr-1" />
                              {enrollment.completed ? 'Review' : 'Continue'}
                            </Button>
                          </Link>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Progress</span>
                          <span className="text-white">{enrollment.progress}%</span>
                        </div>
                        <Progress value={enrollment.progress} className="h-2" />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Achievements */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/labs" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Explore 3D Labs
                  </Button>
                </Link>
                <Link to="/jobs" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Browse Jobs
                  </Button>
                </Link>
                <Link to="/resume-builder" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Build Resume
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-sm">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{achievement.title}</p>
                      <p className="text-white/60 text-xs">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommended for You */}
        <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Recommended for You</CardTitle>
                <CardDescription className="text-white/70">
                  Based on your learning path and interests
                </CardDescription>
              </div>
              <Link to="/courses">
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="group cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg mb-3 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">Advanced React Concepts</h3>
                <p className="text-white/60 text-sm mb-2">Master hooks, context, and performance optimization</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-purple-500/30 text-purple-200 border border-purple-400/30">
                    Advanced
                  </Badge>
                  <span className="text-white/60 text-sm">6h 30m</span>
                </div>
              </div>

              <div className="group cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-green-600 to-teal-600 rounded-lg mb-3 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">Machine Learning Basics</h3>
                <p className="text-white/60 text-sm mb-2">Introduction to ML algorithms and applications</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-500/30 text-green-200 border border-green-400/30">
                    Beginner
                  </Badge>
                  <span className="text-white/60 text-sm">8h 15m</span>
                </div>
              </div>

              <div className="group cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-orange-600 to-red-600 rounded-lg mb-3 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">Digital Marketing Strategy</h3>
                <p className="text-white/60 text-sm mb-2">Build effective marketing campaigns</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-orange-500/30 text-orange-200 border border-orange-400/30">
                    Intermediate
                  </Badge>
                  <span className="text-white/60 text-sm">5h 45m</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="job-search">
            <JobSearchAgent />
          </TabsContent>

          <TabsContent value="tutor">
            <LearningTutor />
          </TabsContent>

          <TabsContent value="interview-prep">
            <InterviewQuestionsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
