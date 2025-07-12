
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, User, Mail, Phone, MapPin, Briefcase, GraduationCap, Award } from "lucide-react";
import { Link } from "react-router-dom";

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+91 9876543210",
      location: "Mumbai, Maharashtra",
      summary: "Passionate full-stack developer with expertise in modern web technologies"
    },
    experience: [
      {
        title: "Junior Developer",
        company: "Tech Solutions Ltd",
        duration: "2023 - Present",
        description: "Developed web applications using React and Node.js"
      }
    ],
    education: [
      {
        degree: "Bachelor of Computer Science",
        institution: "Mumbai University",
        year: "2023",
        grade: "8.5 CGPA"
      }
    ],
    skills: ["React.js", "Node.js", "JavaScript", "Python", "MongoDB", "Git"],
    certificates: [
      {
        name: "Full Stack Web Development",
        issuer: "SKILL BHARAT",
        date: "2024",
        verified: true
      },
      {
        name: "Digital Marketing Fundamentals",
        issuer: "SKILL BHARAT",
        date: "2024",
        verified: true
      }
    ]
  });

  const handleInputChange = (section: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">AI Resume Builder</h1>
            <p className="text-white/70">Create professional resumes with your SKILL BHARAT achievements</p>
          </div>
          <Link to="/dashboard">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Resume Builder Form */}
          <div className="space-y-6">
            {/* Personal Information */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Full Name</Label>
                    <Input
                      id="name"
                      value={resumeData.personalInfo.name}
                      onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">Phone</Label>
                    <Input
                      id="phone"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">Location</Label>
                    <Input
                      id="location"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summary" className="text-white">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    value={resumeData.personalInfo.summary}
                    onChange={(e) => handleInputChange('personalInfo', 'summary', e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills from SKILL BHARAT */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Skills (Auto-populated from courses)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <Badge key={index} className="bg-gradient-to-r from-orange-500 to-pink-500">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <p className="text-white/60 text-sm mt-3">
                  Skills are automatically added based on your completed courses and lab activities
                </p>
              </CardContent>
            </Card>

            {/* Certificates */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Certificates (From SKILL BHARAT)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {resumeData.certificates.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div>
                      <h3 className="font-medium text-white">{cert.name}</h3>
                      <p className="text-white/60 text-sm">{cert.issuer} • {cert.date}</p>
                    </div>
                    {cert.verified && (
                      <Badge className="bg-green-500/20 text-green-300">
                        Verified
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                <Eye className="w-4 h-4 mr-2" />
                Preview Resume
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Resume Preview */}
          <div className="lg:sticky lg:top-6">
            <Card className="bg-white text-black min-h-[800px]">
              <CardContent className="p-8">
                {/* Header */}
                <div className="text-center mb-8 border-b border-gray-200 pb-6">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {resumeData.personalInfo.name}
                  </h1>
                  <div className="flex items-center justify-center gap-4 text-gray-600 text-sm">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {resumeData.personalInfo.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {resumeData.personalInfo.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {resumeData.personalInfo.location}
                    </div>
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Professional Summary
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {resumeData.personalInfo.summary}
                  </p>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">Technical Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Professional Experience
                  </h2>
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-gray-800">{exp.title}</h3>
                        <span className="text-gray-600 text-sm">{exp.duration}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{exp.company}</p>
                      <p className="text-gray-700 text-sm">{exp.description}</p>
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </h2>
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="mb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                          <p className="text-gray-600 text-sm">{edu.institution}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600 text-sm">{edu.year}</p>
                          <p className="text-gray-600 text-sm">{edu.grade}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Certificates */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Certifications
                  </h2>
                  {resumeData.certificates.map((cert, index) => (
                    <div key={index} className="mb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">{cert.name}</h3>
                          <p className="text-gray-600 text-sm">{cert.issuer}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600 text-sm">{cert.date}</p>
                          {cert.verified && (
                            <p className="text-green-600 text-xs">✓ Verified</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
