
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useCertificates } from "@/hooks/useCertificates";
import { useUserEnrollments } from "@/hooks/useUserEnrollments";
import ProfessionalResumeBuilder from "@/components/ProfessionalResumeBuilder";

const ResumeBuilder = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { certificates } = useCertificates();
  const { enrollments } = useUserEnrollments();

  // Prepare initial data for the resume builder
  const initialData = {
    personalInfo: {
      name: profile?.full_name || user?.email || "",
      email: profile?.email || user?.email || "",
      phone: "",
      location: "",
      summary: ""
    },
    skills: enrollments?.map(enrollment => enrollment.course?.title).filter(Boolean) || [],
    certifications: certificates.map(cert =>
      `${cert.course?.title || "Certificate"} - SKILL BHARAT (${new Date(cert.issued_at).getFullYear()})`
    )
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
        {/* Features Section */}
        <div className="mb-8">
          <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Professional Resume Builder Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Multiple Templates</h3>
                  <p className="text-white/70 text-sm">Choose from modern, classic, and minimal designs</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Auto-populated Data</h3>
                  <p className="text-white/70 text-sm">Skills and certificates from your SKILL BHARAT profile</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">PDF Export</h3>
                  <p className="text-white/70 text-sm">Download professional PDF resumes instantly</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Professional Resume Builder */}
        <ProfessionalResumeBuilder initialData={initialData} />
      </div>
    </div>
  );
};

export default ResumeBuilder;
