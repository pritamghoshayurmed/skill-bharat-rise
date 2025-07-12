
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Eye, Award, CheckCircle, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useCertificates } from "@/hooks/useCertificates";

const Certificates = () => {
  const { certificates, loading } = useCertificates();

  // Mock certificates for demonstration - replace with real data
  const mockCertificates = [
    {
      id: 1,
      title: "Full Stack Web Development",
      issuer: "SKILL BHARAT",
      issueDate: "February 15, 2024",
      grade: "A+",
      score: "95%",
      credentialId: "SB-2024-FSWD-001",
      skills: ["React.js", "Node.js", "MongoDB", "JavaScript"],
      verified: true,
      category: "Programming"
    },
    {
      id: 2,
      title: "Digital Marketing Fundamentals",
      issuer: "SKILL BHARAT",
      issueDate: "January 28, 2024",
      grade: "A",
      score: "88%",
      credentialId: "SB-2024-DMF-002",
      skills: ["SEO", "Social Media Marketing", "Google Analytics", "Content Strategy"],
      verified: true,
      category: "Marketing"
    },
    {
      id: 3,
      title: "Traditional Embroidery Mastery",
      issuer: "SKILL BHARAT",
      issueDate: "January 15, 2024",
      grade: "A+",
      score: "92%",
      credentialId: "SB-2024-TEM-003",
      skills: ["Hand Embroidery", "Pattern Design", "Color Theory", "Traditional Techniques"],
      verified: true,
      category: "Handicrafts"
    },
    {
      id: 4,
      title: "Healthcare Technology Basics",
      issuer: "SKILL BHARAT",
      issueDate: "December 20, 2023",
      grade: "B+",
      score: "82%",
      credentialId: "SB-2023-HTB-004",
      skills: ["Medical Devices", "Healthcare IT", "Patient Management", "Compliance"],
      verified: true,
      category: "Healthcare"
    },
    {
      id: 5,
      title: "3D Lab Specialist",
      issuer: "SKILL BHARAT",
      issueDate: "February 10, 2024",
      grade: "A",
      score: "90%",
      credentialId: "SB-2024-3DLS-005",
      skills: ["3D Modeling", "Virtual Labs", "Interactive Learning", "Lab Safety"],
      verified: true,
      category: "Technology"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Programming': return 'from-blue-600 to-purple-600';
      case 'Marketing': return 'from-green-600 to-teal-600';
      case 'Handicrafts': return 'from-pink-600 to-rose-600';
      case 'Healthcare': return 'from-red-600 to-orange-600';
      case 'Technology': return 'from-indigo-600 to-blue-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes('A+')) return 'bg-green-500/20 text-green-300';
    if (grade.includes('A')) return 'bg-blue-500/20 text-blue-300';
    if (grade.includes('B')) return 'bg-yellow-500/20 text-yellow-300';
    return 'bg-gray-500/20 text-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Certificates</h1>
            <p className="text-white/70">Your verified achievements and credentials</p>
          </div>
          <Link to="/dashboard">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Total Certificates</p>
                  <p className="text-3xl font-bold text-white">{certificates.length}</p>
                </div>
                <Award className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Verified</p>
                  <p className="text-3xl font-bold text-green-400">
                    {certificates.filter(cert => cert.verified).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Average Grade</p>
                  <p className="text-3xl font-bold text-white">A</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">This Month</p>
                  <p className="text-3xl font-bold text-white">2</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-white/60">Loading certificates...</div>
          ) : certificates.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Award className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/60">No certificates earned yet</p>
              <p className="text-white/40 text-sm">Complete courses to earn certificates</p>
            </div>
          ) : (
            certificates.map((certificate) => (
            <Card key={certificate.id} className="bg-black/40 backdrop-blur-xl border border-white/10 group hover:border-white/20 transition-all">
              <CardContent className="p-0">
                {/* Certificate Header with Gradient */}
                <div className={`bg-gradient-to-br ${getCategoryColor(certificate.course?.category || 'General')} p-6 rounded-t-lg relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <Award className="w-8 h-8 text-white" />
                      <Badge className="bg-white/20 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{certificate.course?.title || 'Certificate'}</h3>
                    <p className="text-white/90 text-sm">SKILL BHARAT</p>
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getGradeColor(certificate.grade || 'Completed')}>
                      Grade: {certificate.grade || 'Completed'}
                    </Badge>
                    <span className="text-white/70 text-sm">{certificate.score ? `${certificate.score}%` : 'Passed'}</span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <Calendar className="w-4 h-4" />
                      Issued: {new Date(certificate.issued_at).toLocaleDateString()}
                    </div>
                    <div className="text-white/60 text-xs">
                      ID: {certificate.id}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <p className="text-white/80 text-sm font-medium mb-2">Skills Certified:</p>
                    <div className="flex flex-wrap gap-1">
                      {certificate.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-white/10 text-white/80 text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {certificate.skills.length > 3 && (
                        <Badge variant="secondary" className="bg-white/10 text-white/80 text-xs">
                          +{certificate.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Share2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
          )}
        </div>

        {/* Certificate Actions */}
        <div className="mt-12 text-center">
          <Card className="bg-black/40 backdrop-blur-xl border border-white/10 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white">Share Your Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/70">
                Show off your verified skills and certifications to potential employers and your network.
              </p>
              <div className="flex gap-4 justify-center">
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  Share on LinkedIn
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Download All Certificates
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Create Digital Badge
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Certificates;
