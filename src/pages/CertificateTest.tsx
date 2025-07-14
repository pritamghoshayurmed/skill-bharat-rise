import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Download } from 'lucide-react';
import { CertificatePreview } from '@/components/CertificatePreview';
import { CertificateService, CertificateData } from '@/lib/certificateService';

const CertificateTest = () => {
  const [showPreview, setShowPreview] = useState(false);

  // Sample certificate data for testing
  const sampleCertificateData: CertificateData = {
    courseId: 'test-course-id',
    courseTitle: 'Adobe Photoshop',
    studentName: 'lawra',
    completionDate: new Date().toISOString(),
    instructor: 'Ranjit bag',
    category: 'Design',
    totalLessons: 25,
    timeSpent: 480,
    verificationCode: 'F02AE9B09500'
  };

  const handleDownloadCertificate = async () => {
    try {
      const pdfBlob = await CertificateService.generatePDF(sampleCertificateData);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Certificate-${sampleCertificateData.courseTitle.replace(/[^a-zA-Z0-9]/g, '-')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading certificate:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Certificate Design Test</h1>
          <p className="text-white/70 text-lg">
            Test the new professional certificate design matching your reference
          </p>
        </div>

        <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-center">
              Professional Certificate Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-white/80">
                This certificate design matches the professional reference you provided with:
              </p>
              <ul className="text-white/70 text-left max-w-md mx-auto space-y-2">
                <li>• Beautiful gradient background (purple to blue)</li>
                <li>• Professional typography with serif fonts</li>
                <li>• Gold accents for important text</li>
                <li>• Proper spacing and layout</li>
                <li>• Verification code and signature</li>
                <li>• Responsive design for all devices</li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setShowPreview(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview Certificate
              </Button>
              <Button
                onClick={handleDownloadCertificate}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Sample
              </Button>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-medium mb-2">Sample Certificate Data:</h3>
              <div className="text-white/70 text-sm space-y-1">
                <div><strong>Student:</strong> {sampleCertificateData.studentName}</div>
                <div><strong>Course:</strong> {sampleCertificateData.courseTitle}</div>
                <div><strong>Instructor:</strong> {sampleCertificateData.instructor}</div>
                <div><strong>Category:</strong> {sampleCertificateData.category}</div>
                <div><strong>Completion Date:</strong> {new Date(sampleCertificateData.completionDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</div>
                <div><strong>Verification Code:</strong> {sampleCertificateData.verificationCode}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificate Preview Modal */}
        <CertificatePreview
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          certificateData={sampleCertificateData}
          onDownload={() => {
            setShowPreview(false);
            handleDownloadCertificate();
          }}
        />
      </div>
    </div>
  );
};

export default CertificateTest;
