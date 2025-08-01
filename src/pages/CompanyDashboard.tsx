import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Users, Eye, Plus, Edit, Trash2, Building, BookOpen, GraduationCap, LogOut, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCourses } from "@/hooks/useCourses";
import { useCompanyJobs } from "@/hooks/useCompanyJobs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CourseCreationForm } from "@/components/CourseCreationForm";
import { ModuleCreationForm } from "@/components/ModuleCreationForm";
import { useCompanyStats } from "@/hooks/useCompanyStats";
import { RecruitmentAgent } from "@/components/RecruitmentAgent";

const CompanyDashboard = () => {
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    job_type: "Full-time",
    salary_range: "",
    description: "",
    requirements: "",
    skills_required: ""
  });

  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const { toast } = useToast();
  const { courses, loading: coursesLoading, refetch: refetchCourses } = useCourses();
  const { jobs, loading: jobsLoading, refetch: refetchJobs } = useCompanyJobs();
  const { user, signOut } = useAuth();
  const { stats: companyStats, loading: statsLoading } = useCompanyStats();

  const stats = [
    {
      title: "Active Jobs",
      value: statsLoading ? "..." : companyStats.activeJobs.toString(),
      change: "+3",
      icon: Briefcase,
      color: "from-blue-500 to-purple-500"
    },
    {
      title: "Applications",
      value: statsLoading ? "..." : companyStats.totalApplications.toString(),
      change: "+24",
      icon: Users,
      color: "from-green-500 to-teal-500"
    },
    {
      title: "Profile Views",
      value: "N/A", // Profile views tracking not implemented yet
      change: "N/A",
      icon: Eye,
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Courses Created",
      value: coursesLoading ? "..." : courses.length.toString(),
      change: "+2",
      icon: GraduationCap,
      color: "from-purple-500 to-pink-500"
    }
  ];

  const handleCreateJob = async () => {
    if (!newJob.title || !newJob.description || !newJob.company) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (title, company, description)",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('jobs')
        .insert({
          title: newJob.title,
          company: newJob.company,
          location: newJob.location || null,
          job_type: newJob.job_type,
          salary_range: newJob.salary_range || null,
          description: newJob.description,
          requirements: newJob.requirements ? newJob.requirements.split(',').map(r => r.trim()) : null,
          skills_required: newJob.skills_required ? newJob.skills_required.split(',').map(s => s.trim()) : null,
          posted_by: user?.id,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Job Posted!",
        description: `${newJob.title} position has been posted successfully`,
      });

      setNewJob({
        title: "",
        company: "",
        location: "",
        job_type: "Full-time",
        salary_range: "",
        description: "",
        requirements: "",
        skills_required: ""
      });

      refetchJobs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive"
      });
      console.error('Error posting job:', error);
    }
  };

  const handleCourseCreated = () => {
    refetchCourses();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Company Dashboard</h1>
            <p className="text-white/70">Manage your job postings, courses and applications</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Building className="w-4 h-4 mr-2" />
              Company Profile
            </Button>
            <Button 
              onClick={handleSignOut}
              variant="outline" 
              className="border-red-500/20 text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
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
        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="bg-black/20 border border-white/10">
            <TabsTrigger value="jobs" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
              Job Postings
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
              Course Management
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
              Applications
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="recruitment" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
              <Brain className="w-4 h-4 mr-2" />
              AI Recruitment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Create Job Form */}
              <div className="lg:col-span-1">
                <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Post New Job
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-white">Job Title *</Label>
                      <Input
                        id="title"
                        value={newJob.title}
                        onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="e.g., Full Stack Developer"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-white">Company Name *</Label>
                      <Input
                        id="company"
                        value={newJob.company}
                        onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="e.g., Tech Solutions Inc"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-white">Location</Label>
                        <Input
                          id="location"
                          value={newJob.location}
                          onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          placeholder="Mumbai, India"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="job_type" className="text-white">Job Type</Label>
                        <select
                          id="job_type"
                          value={newJob.job_type}
                          onChange={(e) => setNewJob({...newJob, job_type: e.target.value})}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                        >
                          <option value="Full-time" className="text-black">Full-time</option>
                          <option value="Part-time" className="text-black">Part-time</option>
                          <option value="Contract" className="text-black">Contract</option>
                          <option value="Internship" className="text-black">Internship</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="salary_range" className="text-white">Salary Range</Label>
                      <Input
                        id="salary_range"
                        value={newJob.salary_range}
                        onChange={(e) => setNewJob({...newJob, salary_range: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="₹8-15 LPA"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills_required" className="text-white">Required Skills</Label>
                      <Input
                        id="skills_required"
                        value={newJob.skills_required}
                        onChange={(e) => setNewJob({...newJob, skills_required: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="React, Node.js, MongoDB (comma separated)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requirements" className="text-white">Requirements</Label>
                      <Input
                        id="requirements"
                        value={newJob.requirements}
                        onChange={(e) => setNewJob({...newJob, requirements: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Bachelor's degree, 2+ years experience (comma separated)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-white">Job Description *</Label>
                      <Textarea
                        id="description"
                        value={newJob.description}
                        onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Describe the role and responsibilities..."
                        rows={4}
                      />
                    </div>

                    <Button 
                      onClick={handleCreateJob}
                      className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Post Job
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Jobs List */}
              <div className="lg:col-span-2">
                <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Your Job Postings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {jobsLoading ? (
                      <div className="text-white/60">Loading jobs...</div>
                    ) : jobs.length === 0 ? (
                      <div className="text-center py-8">
                        <Briefcase className="w-12 h-12 text-white/40 mx-auto mb-4" />
                        <p className="text-white/60">No jobs posted yet</p>
                        <p className="text-white/40 text-sm">Create your first job posting to get started</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {jobs.map((job) => (
                          <div key={job.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                            <div>
                              <h3 className="font-semibold text-white">{job.title}</h3>
                              <p className="text-white/60 text-sm">{job.company}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <Badge className={
                                  job.is_active 
                                    ? 'bg-green-500/20 text-green-300' 
                                    : 'bg-yellow-500/20 text-yellow-300'
                                }>
                                  {job.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                                <span className="text-white/60 text-sm">{job.location}</span>
                                <span className="text-white/60 text-sm">{job.job_type}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                <Eye className="w-4 h-4" />
                              </Button>
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
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Course Creation Form */}
              <div>
                <CourseCreationForm onCourseCreated={handleCourseCreated} />
                
                {selectedCourse && (
                  <div className="mt-6">
                    <ModuleCreationForm 
                      courseId={selectedCourse}
                      onModuleCreated={() => {}}
                    />
                  </div>
                )}
              </div>

              {/* Courses List */}
              <div>
                <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Your Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {coursesLoading ? (
                      <div className="text-white/60">Loading courses...</div>
                    ) : courses.length === 0 ? (
                      <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 text-white/40 mx-auto mb-4" />
                        <p className="text-white/60">No courses created yet</p>
                        <p className="text-white/40 text-sm">Create your first course to get started</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {courses.map((course) => (
                          <div 
                            key={course.id} 
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                              selectedCourse === course.id 
                                ? 'bg-orange-500/20 border-orange-500/40' 
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                            onClick={() => setSelectedCourse(selectedCourse === course.id ? null : course.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-white">{course.title}</h3>
                                <div className="flex items-center gap-4 mt-1">
                                  <Badge className="bg-blue-500/20 text-blue-300">
                                    {course.category}
                                  </Badge>
                                  <span className="text-white/60 text-sm">{course.students_enrolled} students</span>
                                  <span className="text-white/60 text-sm">₹{course.price}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white/60" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Applications Dashboard</h3>
                  <p className="text-white/60">Job applications will appear here once candidates start applying</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Hiring Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-white/60" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Analytics Dashboard</h3>
                  <p className="text-white/60">Detailed hiring analytics and insights will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recruitment" className="space-y-6">
            <RecruitmentAgent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanyDashboard;
