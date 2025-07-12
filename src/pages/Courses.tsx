
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Clock, Star, Users, Play, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useCourses } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { courses, loading } = useCourses();
  const { signOut } = useAuth();

  const categories = [
    { id: "all", name: "All Courses", count: courses.length },
    { id: "Programming", name: "Programming", count: courses.filter(c => c.category === "Programming").length },
    { id: "Marketing", name: "Digital Marketing", count: courses.filter(c => c.category === "Marketing").length },
    { id: "Data Science", name: "Data Science", count: courses.filter(c => c.category === "Data Science").length },
    { id: "Handicrafts", name: "Handicrafts", count: courses.filter(c => c.category === "Handicrafts").length },
    { id: "Finance", name: "Finance", count: courses.filter(c => c.category === "Finance").length }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Courses</h1>
              <p className="text-white/70">Discover skills that transform lives</p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm"
                >
                  Back to Dashboard
                </Button>
              </Link>
              <Button 
                onClick={handleSignOut} 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm"
              >
                Sign Out
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-500"
              />
            </div>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Categories */}
          <div className="lg:col-span-1">
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10 sticky top-6">
              <CardHeader>
                <CardTitle className="text-white">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                        : "bg-white/5 text-white/80 hover:bg-white/10 border border-transparent hover:border-white/20"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{category.name}</span>
                      <Badge 
                        variant="secondary" 
                        className={`${
                          selectedCategory === category.id 
                            ? "bg-white/20 text-white" 
                            : "bg-white/10 text-white/70"
                        }`}
                      >
                        {category.count}
                      </Badge>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Courses Grid */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-white/70">
                Showing {filteredCourses.length} of {courses.length} courses
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="bg-black/40 backdrop-blur-xl border border-white/10 group hover:border-white/20 transition-all">
                  <CardContent className="p-0">
                    <div className={`aspect-video bg-gradient-to-br ${getThumbnailGradient(course.category)} rounded-t-lg flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <Play className="w-12 h-12 text-white opacity-80" />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge 
                          variant="secondary" 
                          className="bg-blue-500/30 text-blue-200 border border-blue-400/30"
                        >
                          {course.level || 'Beginner'}
                        </Badge>
                        <span className="text-white/60 text-sm">
                          {course.price === 0 ? 'Free' : `₹${course.price}`}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                        {course.title}
                      </h3>
                      
                      <p className="text-white/70 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration || 'Self-paced'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {course.students_enrolled?.toLocaleString() || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          {course.rating || 0}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/80 text-sm font-medium">{course.instructor}</p>
                        </div>
                        <Link to={`/courses/${course.id}`}>
                          <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium shadow-lg border-0">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Enroll
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white/60" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
                <p className="text-white/60">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
