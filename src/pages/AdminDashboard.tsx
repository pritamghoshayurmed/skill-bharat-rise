
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  BookOpen, 
  Briefcase, 
  Award, 
  Plus, 
  Edit, 
  Trash2, 
  Upload,
  BarChart3,
  Settings,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "university",
    level: "beginner",
    duration: "",
    price: ""
  });

  const { toast } = useToast();

  const stats = [
    { title: "Total Users", value: "12,547", change: "+12%", icon: Users, color: "from-blue-500 to-purple-500" },
    { title: "Active Courses", value: "186", change: "+8%", icon: BookOpen, color: "from-green-500 to-teal-500" },
    { title: "Job Postings", value: "1,245", change: "+23%", icon: Briefcase, color: "from-orange-500 to-red-500" },
    { title: "Certificates Issued", value: "8,932", change: "+15%", icon: Award, color: "from-purple-500 to-pink-500" }
  ];

  const recentCourses = [
    { id: 1, title: "Full Stack Development", category: "University", students: 450, status: "Active" },
    { id: 2, title: "Traditional Embroidery", category: "Rural Women", students: 320, status: "Active" },
    { id: 3, title: "Digital Marketing", category: "Youth", students: 680, status: "Draft" },
    { id: 4, title: "Healthcare Tech", category: "University", students: 290, status: "Active" }
  ];

  const handleCreateCourse = () => {
    if (!newCourse.title || !newCourse.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Course Created!",
      description: `${newCourse.title} has been created successfully`,
    });

    setNewCourse({
      title: "",
      description: "",
      category: "university",
      level: "beginner",
      duration: "",
      price: ""
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-white/70">Manage SKILL BHARAT platform</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
              <Globe className="w-4 h-4 mr-2" />
              View Platform
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="bg-black/40 backdrop-blur-xl border border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm">{stat.title}</p>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                      <p className="text-green-400 text-sm">{stat.change}</p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="bg-black/20 border border-white/10">
            <TabsTrigger value="courses" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
              Courses
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
              Users
            </TabsTrigger>
            <TabsTrigger value="jobs" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
              Jobs
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Create Course Form */}
              <div className="lg:col-span-1">
                <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Create New Course
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-white">Course Title</Label>
                      <Input
                        id="title"
                        value={newCourse.title}
                        onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Enter course title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-white">Description</Label>
                      <Textarea
                        id="description"
                        value={newCourse.description}
                        onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Course description"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-white">Category</Label>
                      <select
                        id="category"
                        value={newCourse.category}
                        onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                      >
                        <option value="university" className="text-black">University Students</option>
                        <option value="rural-women" className="text-black">Rural Women</option>
                        <option value="youth" className="text-black">Underserved Youth</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="level" className="text-white">Level</Label>
                        <select
                          id="level"
                          value={newCourse.level}
                          onChange={(e) => setNewCourse({...newCourse, level: e.target.value})}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                        >
                          <option value="beginner" className="text-black">Beginner</option>
                          <option value="intermediate" className="text-black">Intermediate</option>
                          <option value="advanced" className="text-black">Advanced</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="duration" className="text-white">Duration</Label>
                        <Input
                          id="duration"
                          value={newCourse.duration}
                          onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          placeholder="e.g., 40 hours"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-white">Price</Label>
                      <Input
                        id="price"
                        value={newCourse.price}
                        onChange={(e) => setNewCourse({...newCourse, price: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Free or ₹1299"
                      />
                    </div>

                    <Button 
                      onClick={handleCreateCourse}
                      className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Course
                    </Button>

                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Content
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Courses List */}
              <div className="lg:col-span-2">
                <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentCourses.map((course) => (
                        <div key={course.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                          <div>
                            <h3 className="font-semibold text-white">{course.title}</h3>
                            <div className="flex items-center gap-4 mt-1">
                              <Badge variant="secondary" className="bg-white/10 text-white/80">
                                {course.category}
                              </Badge>
                              <span className="text-white/60 text-sm">{course.students} students</span>
                              <Badge className={
                                course.status === 'Active' 
                                  ? 'bg-green-500/20 text-green-300' 
                                  : 'bg-yellow-500/20 text-yellow-300'
                              }>
                                {course.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-white/60 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">User Management</h3>
                  <p className="text-white/60">User management features will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Job Portal Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Briefcase className="w-12 h-12 text-white/60 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Job Management</h3>
                  <p className="text-white/60">Job posting and company management features</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Platform Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-white/60 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Analytics Dashboard</h3>
                  <p className="text-white/60">Detailed analytics and reporting will be shown here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
