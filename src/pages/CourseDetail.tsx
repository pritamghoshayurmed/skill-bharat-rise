
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, Clock, Users, Star, CheckCircle, Lock, Download, Award } from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [enrolledModules, setEnrolledModules] = useState<number[]>([1, 2]);

  // Mock course data
  const course = {
    id: 1,
    title: "Full Stack Web Development",
    description: "Master modern web development with React, Node.js, and databases. This comprehensive course will take you from beginner to professional developer.",
    instructor: "Dr. Priya Sharma",
    instructorBio: "Senior Software Engineer with 10+ years of experience at top tech companies",
    duration: "40 hours",
    students: 1250,
    rating: 4.8,
    reviews: 324,
    level: "Intermediate",
    price: "Free",
    category: "university",
    enrolled: false,
    progress: 0
  };

  const modules = [
    {
      id: 1,
      title: "Introduction to Web Development",
      duration: "2h 30m",
      lessons: 8,
      completed: true,
      locked: false
    },
    {
      id: 2,
      title: "HTML & CSS Fundamentals",
      duration: "4h 15m",
      lessons: 12,
      completed: true,
      locked: false
    },
    {
      id: 3,
      title: "JavaScript Essentials",
      duration: "6h 45m",
      lessons: 15,
      completed: false,
      locked: false
    },
    {
      id: 4,
      title: "React Framework",
      duration: "8h 30m",
      lessons: 18,
      completed: false,
      locked: true
    },
    {
      id: 5,
      title: "Backend with Node.js",
      duration: "7h 20m",
      lessons: 14,
      completed: false,
      locked: true
    },
    {
      id: 6,
      title: "Database Design",
      duration: "5h 10m",
      lessons: 10,
      completed: false,
      locked: true
    },
    {
      id: 7,
      title: "Full Stack Project",
      duration: "6h 30m",
      lessons: 8,
      completed: false,
      locked: true
    }
  ];

  const skills = [
    "React.js", "Node.js", "Express.js", "MongoDB", "JavaScript ES6+", 
    "HTML5", "CSS3", "RESTful APIs", "Git & GitHub", "Responsive Design"
  ];

  const handleEnrollClick = () => {
    // Mock enrollment logic
    console.log("Enrolling in course:", course.title);
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
                <Badge className="bg-blue-500/20 text-blue-300">
                  {course.level}
                </Badge>
                <Badge variant="outline" className="border-white/20 text-white">
                  {course.category}
                </Badge>
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>
              <p className="text-xl text-white/80 mb-6">{course.description}</p>

              <div className="flex items-center gap-6 text-white/70">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{course.rating} ({course.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-black/40 backdrop-blur-xl border border-white/10 sticky top-6">
                <CardContent className="p-6">
                  <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mb-6 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" />
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-white mb-2">{course.price}</div>
                    {course.enrolled && (
                      <div className="space-y-2">
                        <p className="text-green-400 text-sm">✓ Enrolled</p>
                        <Progress value={course.progress} className="h-2" />
                        <p className="text-white/70 text-sm">{course.progress}% Complete</p>
                      </div>
                    )}
                  </div>

                  {!course.enrolled ? (
                    <Button 
                      onClick={handleEnrollClick}
                      className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 mb-4"
                    >
                      Enroll Now
                    </Button>
                  ) : (
                    <Button className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 mb-4">
                      Continue Learning
                    </Button>
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
      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-black/20 rounded-lg p-1">
          {["overview", "curriculum", "instructor", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-black/40 backdrop-blur-xl border border-white/10 mb-6">
                <CardHeader>
                  <CardTitle className="text-white">What You'll Learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2 text-white/80">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Course Description</CardTitle>
                </CardHeader>
                <CardContent className="text-white/80 space-y-4">
                  <p>
                    This comprehensive Full Stack Web Development course is designed to take you from a complete beginner 
                    to a professional developer capable of building modern web applications.
                  </p>
                  <p>
                    You'll start with the fundamentals of web development, learning HTML, CSS, and JavaScript. 
                    Then we'll dive deep into React.js for frontend development and Node.js for backend services.
                  </p>
                  <p>
                    By the end of this course, you'll have built several real-world projects and have the skills 
                    to pursue a career in web development or start your own tech venture.
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
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Modules</span>
                    <span className="font-medium">{modules.length}</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Level</span>
                    <span className="font-medium">{course.level}</span>
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
          <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Course Curriculum</CardTitle>
              <p className="text-white/70">
                {modules.length} modules • {modules.reduce((acc, module) => acc + module.lessons, 0)} lessons
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {modules.map((module) => (
                <div key={module.id} className={`p-4 rounded-lg border ${
                  module.locked ? 'bg-white/5 border-white/10' : 'bg-white/10 border-white/20'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {module.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : module.locked ? (
                        <Lock className="w-5 h-5 text-white/40" />
                      ) : (
                        <Play className="w-5 h-5 text-orange-400" />
                      )}
                      <div>
                        <h3 className={`font-semibold ${module.locked ? 'text-white/60' : 'text-white'}`}>
                          {module.title}
                        </h3>
                        <p className="text-white/60 text-sm">
                          {module.lessons} lessons • {module.duration}
                        </p>
                      </div>
                    </div>
                    {!module.locked && (
                      <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        {module.completed ? "Review" : "Start"}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {activeTab === "instructor" && (
          <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Meet Your Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">PS</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{course.instructor}</h3>
                  <p className="text-white/80 mb-4">{course.instructorBio}</p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">15+</div>
                      <div className="text-white/60 text-sm">Courses</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">25K+</div>
                      <div className="text-white/60 text-sm">Students</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">4.9</div>
                      <div className="text-white/60 text-sm">Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "reviews" && (
          <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Student Reviews</CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">{course.rating}</span>
                </div>
                <span className="text-white/70">({course.reviews} reviews)</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3].map((review) => (
                <div key={review} className="border-b border-white/10 pb-6 last:border-b-0">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">A</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-white">Anonymous Student</span>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-white/80">
                        Excellent course! The instructor explains complex concepts very clearly. 
                        I was able to build my first full-stack application after completing this course.
                      </p>
                      <p className="text-white/60 text-sm mt-2">2 weeks ago</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
