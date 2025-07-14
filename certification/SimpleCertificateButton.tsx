import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Download, CheckCircle, Clock, BookOpen, Eye } from 'lucide-react';
import { useCourseEnrollment } from '@/hooks/useCourseEnrollment';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { CertificateService, CertificateGeneration, CertificateData } from '@/lib/certificateService';
import { CertificatePreview } from '@/components/CertificatePreview';


interface SimpleCertificateButtonProps {
  courseId: string;
}

export const SimpleCertificateButton: React.FC<SimpleCertificateButtonProps> = ({
  courseId
}) => {
  const { courses } = useCourses();
  const course = courses.find(c => c.id === courseId);
  const { enrollment } = useCourseEnrollment(courseId);
  const { progressData, loading: progressLoading } = useCourseProgress(courseId);
  const { user } = useAuth();
  const { toast } = useToast();
  const [certificate, setCertificate] = useState<CertificateGeneration | null>(null);
  const [generating, setGenerating] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  // Use the new lesson-based progress tracking
  const progress = progressData?.overall_progress || enrollment?.progress || 0;
  const isCompleted = progressData?.is_completed || enrollment?.completed || progress >= 100;
  const canGenerateCertificate = isCompleted && !progressLoading && user;

  // Check for existing certificate on component mount
  useEffect(() => {
    const checkExistingCertificate = async () => {
      if (user && courseId && isCompleted) {
        setChecking(true);
        const existingCert = await CertificateService.checkExistingCertificate(user.id, courseId);
        setCertificate(existingCert);
        setChecking(false);
      } else {
        setChecking(false);
      }
    };

    checkExistingCertificate();
  }, [user, courseId, isCompleted]);

  const handleGenerateCertificate = async () => {
    if (!canGenerateCertificate || !course || !progressData || !user) return;

    setGenerating(true);
    try {
      // Generate certificate data
      const certificateData = {
        courseId: course.id,
        courseTitle: course.title,
        studentName: user.email?.split('@')[0] || "Student", // Use email username as name
        completionDate: progressData.completion_date || new Date().toISOString(),
        instructor: course.instructor || "Instructor",
        category: course.category || "General",
        totalLessons: progressData.total_lessons,
        timeSpent: progressData.time_spent_minutes,
        verificationCode: `CERT-${courseId.slice(0, 8).toUpperCase()}-${Date.now()}`
      };

      // Generate certificate using the service
      const result = await CertificateService.generateCertificate(user.id, certificateData);

      if (result.success && result.certificate) {
        setCertificate(result.certificate);
        toast({
          title: "Certificate Generated! 🎉",
          description: `Congratulations! Your certificate for "${course.title}" has been generated successfully.`,
        });
      } else {
        throw new Error(result.error || 'Failed to generate certificate');
      }

    } catch (error: any) {
      console.error('Certificate generation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate certificate. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const createCertificateData = (): CertificateData => {
    if (!course || !progressData || !user) {
      throw new Error('Missing required data for certificate generation');
    }

    return {
      courseId: course.id,
      courseTitle: course.title,
      studentName: user.email?.split('@')[0] || "Student",
      completionDate: progressData.completion_date || new Date().toISOString(),
      instructor: course.instructor || "Skill Bharat Team",
      category: course.category || "General",
      totalLessons: progressData.total_lessons,
      timeSpent: progressData.time_spent_minutes,
      verificationCode: certificate?.verification_code || `CERT-${courseId.slice(0, 8).toUpperCase()}-${Date.now()}`
    };
  };

  const handlePreviewCertificate = () => {
    setShowPreview(true);
  };

  const handleDownloadCertificate = async () => {
    if (!certificate) return;

    try {
      await CertificateService.downloadCertificate(certificate);
      toast({
        title: "Certificate Downloaded!",
        description: "Your certificate has been downloaded successfully.",
      });
    } catch (error: any) {
      console.error('Certificate download error:', error);
      toast({
        title: "Error",
        description: "Failed to download certificate. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStageStatus = () => {
    if (!isCompleted) {
      return {
        stage: 1,
        title: "Complete Course",
        status: "in-progress",
        description: `${progress}% completed`
      };
    } else {
      return {
        stage: 2,
        title: "Certificate Ready",
        status: "completed",
        description: "All requirements met"
      };
    }
  };

  const currentStage = getStageStatus();

  return (
    <Card className="bg-black/40 backdrop-blur-xl border border-white/10 card-spacing prevent-overlap" role="region" aria-labelledby="certificate-title">
      <CardHeader>
        <CardTitle id="certificate-title" className="text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-400" aria-hidden="true" />
          Certificate of Completion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Two-Stage Progress Display */}
        <div className="space-y-4">
          {/* Stage 1: Course Progress */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isCompleted ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
              }`}>
                {isCompleted ? <CheckCircle className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Stage 1: Complete Course</span>
                  <Badge className={
                    isCompleted
                      ? 'bg-green-500/20 text-green-300'
                      : progress > 0
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-gray-500/20 text-gray-300'
                  }>
                    {progress}% Complete
                  </Badge>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Certificate Generation Section */}
        <div className="border-t border-white/10 pt-4">
          {canGenerateCertificate ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">All requirements completed!</span>
              </div>
              
              {progressData && (
                <div className="space-y-2 text-white/60 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>{progressData.completed_lessons}/{progressData.total_lessons} lessons completed</span>
                  </div>
                  {progressData.completion_date && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Completed on {new Date(progressData.completion_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {progressData.time_spent_minutes > 0 && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{progressData.time_spent_minutes} minutes of learning</span>
                    </div>
                  )}
                </div>
              )}

              {certificate ? (
                <div className="space-y-2">
                  <Button
                    onClick={handlePreviewCertificate}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium keyboard-nav"
                    aria-describedby="certificate-description"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Certificate
                  </Button>
                  <Button
                    onClick={handleDownloadCertificate}
                    variant="outline"
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 keyboard-nav"
                    aria-describedby="certificate-description"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    onClick={handlePreviewCertificate}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium keyboard-nav"
                    aria-describedby="certificate-description"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Certificate
                  </Button>
                  <Button
                    onClick={handleGenerateCertificate}
                    disabled={generating || checking}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium keyboard-nav"
                    aria-describedby="certificate-description"
                  >
                    {generating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Generating Certificate...
                      </>
                    ) : checking ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Checking Certificate...
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4 mr-2" />
                        Generate Certificate
                      </>
                    )}
                  </Button>
                </div>
              )}

              <p id="certificate-description" className="text-xs text-white/50 text-center">
                Your certificate will include your name, course details, completion date, and verification code.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-center text-white/60">
                <Award className="w-8 h-8 mx-auto mb-2 text-white/40" />
                <p className="text-sm font-medium">{currentStage.title}</p>
                <p className="text-xs text-white/50 mt-1">{currentStage.description}</p>
              </div>

              {/* Show current stage status */}
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-center">
                  <p className="text-sm text-white/70 mb-2">Next Step:</p>
                  {!isCompleted ? (
                    <p className="text-sm text-blue-300">Complete all course lessons and modules</p>
                  ) : (
                    <p className="text-sm text-green-300">Ready to generate certificate!</p>
                  )}
                </div>
              </div>

              <Button
                disabled
                className="w-full bg-white/10 text-white/50 cursor-not-allowed"
              >
                <Award className="w-4 h-4 mr-2" />
                Certificate Locked
              </Button>
            </div>
          )}
        </div>

        {/* Course Details */}
        <div className="border-t border-white/10 pt-4 space-y-2">
          <h4 className="text-white font-medium text-sm">Certificate Details</h4>
          <div className="space-y-1 text-xs text-white/60">
            <div className="flex justify-between">
              <span>Course:</span>
              <span className="text-white/80">{course?.title || 'Course'}</span>
            </div>
            {course?.instructor && (
              <div className="flex justify-between">
                <span>Instructor:</span>
                <span className="text-white/80">{course.instructor}</span>
              </div>
            )}
            {course?.category && (
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="text-white/80">{course.category}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Verification:</span>
              <span className="text-white/80">Digital signature included</span>
            </div>
          </div>
        </div>



        {/* Debug Info - Remove in production */}
        <div className="border-t border-white/10 pt-2">
          <p className="text-xs text-white/40">
            Debug: Enrolled: {enrollment ? 'Yes' : 'No'} | Progress: {progress}% | Completed: {isCompleted ? 'Yes' : 'No'} |
            Lessons: {progressData?.completed_lessons || 0}/{progressData?.total_lessons || 0} |
            Certificate: {certificate ? 'Generated' : 'Not Generated'}
          </p>
          {certificate && (
            <p className="text-xs text-white/30 mt-1">
              Verification: {certificate.verification_code} | Generated: {new Date(certificate.generated_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </CardContent>

      {/* Certificate Preview Modal */}
      {showPreview && canGenerateCertificate && course && progressData && user && (
        <CertificatePreview
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          certificateData={createCertificateData()}
          onDownload={() => {
            setShowPreview(false);
            handleDownloadCertificate();
          }}
        />
      )}
    </Card>
  );
};
