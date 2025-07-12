
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Clock, Star, Users, Play, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Courses", count: 200 },
    { id: "university", name: "University Students", count: 85 },
    { id: "rural-women", name: "Rural Women", count: 65 },
    { id: "youth", name: "Underserved Youth", count: 50 }
  ];

  const courses = [
    {
      id: 1,
      title: "Full Stack Web Development",
      description: "Master modern web development with React, Node.js, and databases",
      category: "university",
      level: "Intermediate",
      duration: "40 hours",
      students: 1250,
      rating: 4.8,
      instructor: "Dr. Priya Sharma",
      thumbnail: "coding",
      price: "Free"
    },
    {
      id: 2,
      title: "Traditional Embroidery & Handicrafts",
      description: "Learn traditional Indian embroidery techniques and start your business",
      category: "rural-women",
      level: "Beginner",
      duration: "25 hours",
      students: 890,
      rating: 4.9,
      instructor: "Mrs. Sunita Devi",
      thumbnail: "handicraft",
      price: "₹599"
    },
    {
      id: 3,
      title: "Digital Marketing Fundamentals",
      description: "Build your online presence and marketing skills",
      category: "youth",
      level: "Beginner",
      duration: "20 hours",
      students: 2100,
      rating: 4.7,
      instructor: "Rajesh Kumar",
      thumbnail: "marketing",
      price: "Free"
    },
    {
      id: 4,
      title: "Healthcare Technology",
      description: "Explore the intersection of healthcare and technology",
      category: "university",
      level: "Advanced",
      duration: "35 hours",
      students: 750,
      rating: 4.6,
      instructor: "Dr. Amit Patel",
      thumbnail: "healthcare",
      price: "₹1299"
    },
    {
      id: 5,
      title: "Tailoring & Fashion Design",
      description: "Professional tailoring skills and fashion design principles",
      category: "rural-women",
      level: "Intermediate",
      duration: "30 hours",
      students: 1450,
      rating: 4.8,
      instructor: "Meera Singh",
      thumbnail: "fashion",
      price: "₹899"
    },
    {
      id: 6,
      title: "Basic Computer Skills",
      description: "Essential computer literacy for the digital age",
      category: "youth",
      level: "Beginner",
      duration: "15 hours",
      students: 3200,
      rating: 4.5,
      instructor: "Anita Verma",
      thumbnail: "computer",
      price: "Free"
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getThumbnailGradient = (type: string) => {
    const gradients = {
      coding: "from-blue-600 to-purple-600",
      handicraft: "from-pink-600 to-rose-600",
      marketing: "from-green-600 to-teal-600",
      healthcare: "from-red-600 to-orange-600",
      fashion: "from-purple-600 to-pink-600",
      computer: "from-indigo-600 to-blue-600"
    };
    return gradients[type as keyof typeof gradients] || "from-gray-600 to-gray-700";
  };

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
            <Link to="/dashboard">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Back to Dashboard
              </Button>
            </Link>
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
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
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
                        ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                        : "bg-white/5 text-white/80 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{category.name}</span>
                      <Badge variant="secondary" className="bg-white/20">
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
                    <div className={`aspect-video bg-gradient-to-br ${getThumbnailGradient(course.thumbnail)} rounded-t-lg flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <Play className="w-12 h-12 text-white opacity-80" />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge 
                          variant="secondary" 
                          className={`${
                            course.category === 'university' ? 'bg-blue-500/20 text-blue-300' :
                            course.category === 'rural-women' ? 'bg-pink-500/20 text-pink-300' :
                            'bg-green-500/20 text-green-300'
                          }`}
                        >
                          {course.level}
                        </Badge>
                        <span className="text-white/60 text-sm">{course.price}</span>
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
                          {course.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {course.students.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          {course.rating}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/80 text-sm font-medium">{course.instructor}</p>
                        </div>
                        <Link to={`/courses/${course.id}`}>
                          <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
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
