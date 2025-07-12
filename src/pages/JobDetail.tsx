
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, Briefcase, Building, Heart, Share2, CheckCircle } from "lucide-react";

const JobDetail = () => {
  const { id } = useParams();

  // Mock job data
  const job = {
    id: 1,
    title: "Full Stack Developer",
    company: "TechCorp India",
    location: "Bangalore, Karnataka",
    type: "Full-time",
    experience: "2-4 years",
    salary: "₹8-15 LPA",
    postedDate: "2 days ago",
    skills: ["React", "Node.js", "MongoDB", "JavaScript", "Express.js", "AWS"],
    description: "We are looking for a skilled full-stack developer to join our growing team and help us build the next generation of web applications.",
    responsibilities: [
      "Develop and maintain web applications using React and Node.js",
      "Design and implement RESTful APIs",
      "Collaborate with UI/UX designers to implement user interfaces",
      "Write clean, maintainable, and well-documented code",
      "Participate in code reviews and technical discussions",
      "Deploy and maintain applications on AWS infrastructure"
    ],
    requirements: [
      "Bachelor's degree in Computer Science or related field",
      "2-4 years of experience in full-stack development",
      "Strong proficiency in React.js and Node.js",
      "Experience with MongoDB or other NoSQL databases",
      "Knowledge of RESTful API design and implementation",
      "Familiarity with version control systems (Git)",
      "Good understanding of responsive web design",
      "Excellent problem-solving and communication skills"
    ],
    benefits: [
      "Competitive salary and performance bonuses",
      "Health insurance for employee and family",
      "Flexible working hours and remote work options",
      "Professional development opportunities",
      "Modern office space with latest technology",
      "Team outings and company events"
    ],
    companyInfo: {
      name: "TechCorp India",
      size: "200-500 employees",
      industry: "Technology",
      founded: "2018",
      description: "TechCorp India is a leading technology company focused on building innovative web solutions for businesses across India.",
      website: "https://techcorp.in"
    },
    applicationProcess: [
      "Submit your application with resume and cover letter",
      "Initial screening call with HR team",
      "Technical interview with engineering team",
      "Final interview with hiring manager",
      "Reference checks and offer discussion"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/jobs" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">TC</span>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
                  <p className="text-xl text-white/80 mb-3">{job.company}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-white/70">
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
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <Badge className="bg-green-500/20 text-green-300 text-lg px-4 py-2">
                  {job.salary}
                </Badge>
                <Badge variant="outline" className="border-white/20 text-white">
                  {job.experience}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-white/10 text-white/80">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-black/40 backdrop-blur-xl border border-white/10 sticky top-6">
                <CardContent className="p-6">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 mb-4">
                    Apply Now
                  </Button>
                  
                  <div className="flex gap-2 mb-6">
                    <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                      <Heart className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-white/80">
                      <span>Job Type</span>
                      <span className="font-medium">{job.type}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Experience</span>
                      <span className="font-medium">{job.experience}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Industry</span>
                      <span className="font-medium">{job.companyInfo.industry}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Company Size</span>
                      <span className="font-medium">{job.companyInfo.size}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Job Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Job Description</CardTitle>
              </CardHeader>
              <CardContent className="text-white/80">
                <p className="leading-relaxed">{job.description}</p>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Key Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-3 text-white/80">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3 text-white/80">
                      <CheckCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Benefits & Perks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3 text-white/80">
                      <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Application Process */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Application Process</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {job.applicationProcess.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-white/80">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {/* Company Info */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  About {job.companyInfo.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/80 text-sm leading-relaxed">
                  {job.companyInfo.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/70">
                    <span>Founded</span>
                    <span className="text-white">{job.companyInfo.founded}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Industry</span>
                    <span className="text-white">{job.companyInfo.industry}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Company Size</span>
                    <span className="text-white">{job.companyInfo.size}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  Visit Company Website
                </Button>
              </CardContent>
            </Card>

            {/* Similar Jobs */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Similar Jobs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: "Frontend Developer", company: "StartupXYZ", salary: "₹6-10 LPA" },
                  { title: "Backend Developer", company: "DevCorp", salary: "₹8-12 LPA" },
                  { title: "React Developer", company: "WebTech", salary: "₹7-11 LPA" }
                ].map((similarJob, index) => (
                  <div key={index} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <h3 className="font-medium text-white text-sm">{similarJob.title}</h3>
                    <p className="text-white/60 text-xs">{similarJob.company}</p>
                    <p className="text-green-400 text-xs font-medium">{similarJob.salary}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
