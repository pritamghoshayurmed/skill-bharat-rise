
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, Clock, Users, Star, CheckCircle, Download, Award, BookOpen, Target } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import { useCourseEnrollment } from "@/hooks/useCourseEnrollment";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { CourseModuleList } from "@/components/CourseModuleList";
import { CourseReviewSection } from "@/components/CourseReviewSection";
import { CourseProgressDashboard } from "@/components/CourseProgressDashboard";
import { SimpleCertificateButton } from "../../certification/SimpleCertificateButton";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("curriculum");
  const { courses } = useCourses();
  const { enrollment, loading: enrollmentLoading, enrollInCourse } = useCourseEnrollment(id || '');
  const { progressData, loading: progressLoading } = useCourseProgress(id || '');

  const course = courses.find(c => c.id === id);

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Course not found</div>
      </div>
    );
  }

  const isEnrolled = !!enrollment;
  const progress = progressData?.overall_progress || enrollment?.progress || 0;
  const isCompleted = progressData?.is_completed || false;

  const handleEnrollClick = async () => {
    await enrollInCourse();
  };

  const handleStartLearning = () => {
    // Switch to curriculum tab and scroll to course content
    setActiveTab("curriculum");
    setTimeout(() => {
      const courseContentElement = document.getElementById("course-content");
      if (courseContentElement) {
        courseContentElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const getThumbnailGradient = (category: string | null) => {
    const gradients: { [key: string]: string } = {
      "Programming": "from-blue-600 to-purple-600",
      "Marketing": "from-green-600 to-teal-600",
      "Data Science": "from-indigo-600 to-blue-600",
      "Handicrafts": "from-pink-600 to-rose-600",
      "Finance": "from-yellow-600 to-orange-600"
    };
    return gradients[category || ""] || "from-gray-600 to-gray-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/courses" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-blue-500/20 text-blue-300 border-0">
                  {course.level || 'Beginner'}
                </Badge>
                <Badge variant="outline" className="border-white/20 text-white bg-white/10">
                  {course.category}
                </Badge>
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>
              <p className="text-xl text-white/80 mb-6">{course.description}</p>

              <div className="flex items-center gap-6 text-white/70">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration || 'Self-paced'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{course.students_enrolled?.toLocaleString() || 0} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{course.rating || 0}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-black/40 backdrop-blur-xl border border-white/10 sticky top-6">
                <CardContent className="p-6">
                  <div className={`aspect-video bg-gradient-to-br ${getThumbnailGradient(course.category)} rounded-lg mb-6 flex items-center justify-center`}>
                    <Play className="w-12 h-12 text-white" />
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-white mb-2">
                      {course.price === 0 ? 'Free' : `₹${course.price}`}
                    </div>
                    {isEnrolled && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2">
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <BookOpen className="w-5 h-5 text-orange-400" />
                          )}
                          <p className={`text-sm font-medium ${isCompleted ? 'text-green-400' : 'text-orange-400'}`}>
                            {isCompleted ? '✓ Course Completed!' : '✓ Enrolled'}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm text-white/70">
                            <span>Overall Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-3" />
                        </div>

                        {progressData && (
                          <div className="grid grid-cols-2 gap-3 text-xs text-white/60">
                            <div className="text-center">
                              <div className="text-white font-medium">{progressData.completed_lessons}</div>
                              <div>Lessons Done</div>
                            </div>
                            <div className="text-center">
                              <div className="text-white font-medium">{progressData.total_lessons}</div>
                              <div>Total Lessons</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {!isEnrolled ? (
                    <Button
                      onClick={handleEnrollClick}
                      disabled={enrollmentLoading}
                      className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 mb-4 border-0"
                    >
                      {enrollmentLoading ? 'Enrolling...' : 'Enroll Now'}
                    </Button>
                  ) : isCompleted ? (
                    <div className="space-y-3 mb-4">
                      <Button className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 border-0">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Course Completed
                      </Button>
                      <SimpleCertificateButton courseId={course.id} />
                    </div>
                  ) : (
                    <div className="space-y-2 mb-4">
                      <Button
                        onClick={handleStartLearning}
                        className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 border-0"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Learning
                      </Button>
                      <p className="text-xs text-white/60 text-center">
                        Watch videos and track your progress
                      </p>
                    </div>
                  )}

                  <div className="space-y-3 text-sm text-white/80">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-green-400" />
                      <span>Downloadable resources</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-green-400" />
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div id="course-content" className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-black/20 backdrop-blur-xl rounded-lg p-1 border border-white/10">
          {[
            { key: "curriculum", label: "Lectures", icon: BookOpen },
            { key: "overview", label: "Overview", icon: Target },
            { key: "instructor", label: "Instructor", icon: Users },
            { key: "reviews", label: "Reviews", icon: Star }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-black/40 backdrop-blur-xl border border-white/10 mb-6">
                <CardHeader>
                  <CardTitle className="text-white">Course Description</CardTitle>
                </CardHeader>
                <CardContent className="text-white/80 space-y-4">
                  <p>{course.description}</p>
                  <p>
                    This comprehensive course is designed to provide you with practical skills 
                    and theoretical knowledge in {course.category?.toLowerCase()}.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Course Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-white/80">
                    <span>Duration</span>
                    <span className="font-medium">{course.duration || 'Self-paced'}</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Level</span>
                    <span className="font-medium">{course.level || 'Beginner'}</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Language</span>
                    <span className="font-medium">English/Hindi</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Certificate</span>
                    <span className="font-medium">Yes</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "curriculum" && (
          <div className="space-y-6">
            {/* Progress Dashboard for enrolled users */}
            {isEnrolled && progressData && (
              <CourseProgressDashboard
                progressData={progressData}
                isEnrolled={isEnrolled}
              />
            )}

            {/* Course Modules */}
            <CourseModuleList courseId={course.id} userEnrolled={isEnrolled} />
          </div>
        )}

        {activeTab === "instructor" && (
          <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Meet Your Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {course.instructor?.charAt(0) || 'I'}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{course.instructor}</h3>
                  <p className="text-white/80 mb-4">
                    Experienced instructor with expertise in {course.category?.toLowerCase()}.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "reviews" && (
          <CourseReviewSection courseId={course.id} userEnrolled={isEnrolled} />
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
