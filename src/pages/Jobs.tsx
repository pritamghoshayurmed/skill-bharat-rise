
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, Briefcase, Building, Filter, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const jobs = [
    {
      id: 1,
      title: "Full Stack Developer",
      company: "TechCorp India",
      location: "Bangalore, Karnataka",
      type: "Full-time",
      experience: "2-4 years",
      salary: "₹8-15 LPA",
      postedDate: "2 days ago",
      skills: ["React", "Node.js", "MongoDB", "JavaScript"],
      description: "Looking for a skilled full-stack developer to join our growing team...",
      logo: "TC",
      featured: true
    },
    {
      id: 2,
      title: "Digital Marketing Specialist",
      company: "StartupXYZ",
      location: "Mumbai, Maharashtra",
      type: "Full-time",
      experience: "1-3 years",
      salary: "₹5-8 LPA",
      postedDate: "1 day ago",
      skills: ["SEO", "Social Media", "Google Ads", "Analytics"],
      description: "Join our marketing team to drive growth and brand awareness...",
      logo: "SX",
      featured: false
    },
    {
      id: 3,
      title: "Fashion Designer",
      company: "Ethnic Wear Co.",
      location: "Delhi, NCR",
      type: "Full-time",
      experience: "1-2 years",
      salary: "₹4-6 LPA",
      postedDate: "3 days ago",
      skills: ["Fashion Design", "Pattern Making", "Textiles", "CAD"],
      description: "Creative fashion designer needed for traditional and modern wear...",
      logo: "EW",
      featured: false
    },
    {
      id: 4,
      title: "Data Scientist",
      company: "AI Solutions Ltd",
      location: "Hyderabad, Telangana",
      type: "Full-time",
      experience: "3-5 years",
      salary: "₹12-20 LPA",
      postedDate: "1 week ago",
      skills: ["Python", "Machine Learning", "SQL", "Statistics"],
      description: "Seeking an experienced data scientist to work on ML projects...",
      logo: "AI",
      featured: true
    },
    {
      id: 5,
      title: "Healthcare Tech Specialist",
      company: "MedTech Innovations",
      location: "Chennai, Tamil Nadu",
      type: "Full-time",
      experience: "2-4 years",
      salary: "₹7-12 LPA",
      postedDate: "4 days ago",
      skills: ["Healthcare IT", "Medical Devices", "Compliance", "Training"],
      description: "Healthcare technology specialist for medical device implementation...",
      logo: "MT",
      featured: false
    },
    {
      id: 6,
      title: "UI/UX Designer",
      company: "Design Studio Pro",
      location: "Pune, Maharashtra",
      type: "Full-time",
      experience: "1-3 years",
      salary: "₹6-10 LPA",
      postedDate: "5 days ago",
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
      description: "Creative UI/UX designer for web and mobile applications...",
      logo: "DS",
      featured: false
    }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === "all" || job.location.includes(selectedLocation);
    const matchesType = selectedType === "all" || job.type === selectedType;
    return matchesSearch && matchesLocation && matchesType;
  });

  const locations = ["all", "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune"];
  const jobTypes = ["all", "Full-time", "Part-time", "Contract", "Internship"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Job Portal</h1>
              <p className="text-white/70">Find opportunities that match your newly acquired skills</p>
            </div>
            <Link to="/dashboard">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <Input
                placeholder="Search jobs, companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-500"
              />
            </div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {locations.map(location => (
                <option key={location} value={location} className="text-black">
                  {location === "all" ? "All Locations" : location}
                </option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {jobTypes.map(type => (
                <option key={type} value={type} className="text-black">
                  {type === "all" ? "All Types" : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10 sticky top-6 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-2">Experience Level</h3>
                  <div className="space-y-2">
                    {["Entry Level", "Mid Level", "Senior Level"].map(level => (
                      <label key={level} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-white/20 bg-white/10" />
                        <span className="text-white/80 text-sm">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-2">Salary Range</h3>
                  <div className="space-y-2">
                    {["0-5 LPA", "5-10 LPA", "10-15 LPA", "15+ LPA"].map(range => (
                      <label key={range} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-white/20 bg-white/10" />
                        <span className="text-white/80 text-sm">₹{range}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Job Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-white/80">
                  <span>Total Jobs</span>
                  <span className="font-medium">{jobs.length}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>New Today</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Featured</span>
                  <span className="font-medium">
                    {jobs.filter(job => job.featured).length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-white/70">
                Showing {filteredJobs.length} of {jobs.length} jobs
              </p>
              <div className="flex items-center gap-2">
                <span className="text-white/70 text-sm">Sort by:</span>
                <select className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm">
                  <option className="text-black">Most Recent</option>
                  <option className="text-black">Salary High to Low</option>
                  <option className="text-black">Salary Low to High</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className={`bg-black/40 backdrop-blur-xl border group hover:border-white/20 transition-all ${
                  job.featured ? 'border-orange-500/40' : 'border-white/10'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{job.logo}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-white group-hover:text-orange-300 transition-colors">
                                {job.title}
                              </h3>
                              {job.featured && (
                                <Badge className="bg-orange-500/20 text-orange-300">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <p className="text-white/80 font-medium">{job.company}</p>
                          </div>
                          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4 mb-3 text-white/60 text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.type}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.postedDate}
                          </div>
                        </div>

                        <p className="text-white/70 text-sm mb-3 line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-white/10 text-white/80">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-white/80 font-medium">{job.salary}</span>
                            <span className="text-white/60 text-sm">{job.experience}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                              Save
                            </Button>
                            <Link to={`/jobs/${job.id}`}>
                              <Button size="sm" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                                Apply Now
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-white/60" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
                <p className="text-white/60">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
