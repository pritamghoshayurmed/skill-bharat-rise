
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, Briefcase, Building, Filter, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useJobs } from "@/hooks/useJobs";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const { jobs, loading } = useJobs();

  // Transform database jobs to display format
  const displayJobs = jobs.map(job => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location || "Remote",
    type: job.job_type || "Full-time",
    experience: "Experience required",
    salary: job.salary_range || "Competitive",
    postedDate: new Date(job.created_at).toLocaleDateString(),
    skills: job.skills_required || [],
    description: job.description || "",
    logo: job.company.substring(0, 2).toUpperCase(),
    featured: false
  }));

  const filteredJobs = displayJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === "all" || (job.location && job.location.includes(selectedLocation));
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
                  <span className="font-medium">{displayJobs.length}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>New Today</span>
                  <span className="font-medium">{jobs.filter(job => {
                    const today = new Date();
                    const jobDate = new Date(job.created_at);
                    return jobDate.toDateString() === today.toDateString();
                  }).length}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Featured</span>
                  <span className="font-medium">
                    {displayJobs.filter(job => job.featured).length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-white/70">
                Showing {filteredJobs.length} of {displayJobs.length} jobs
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
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-white/60">Loading jobs...</div>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No jobs found matching your criteria</p>
                  <p className="text-white/40 text-sm">Try adjusting your search filters</p>
                </div>
              ) : (
                filteredJobs.map((job) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
